/* ===========================================================================
   Consultation form — the two emails
   ===========================================================================

   Runs once per submission of the `consultation` form and sends:

     1. A confirmation to the person who submitted it.
     2. A notification to Amy containing everything they said, plus a mailto:
        link that opens a personalised reply already written. One click.

   HOW THIS IS TRIGGERED — read this before looking for a webhook to configure.

   The filename is the trigger. Netlify invokes a function named
   `submission-created` automatically on every verified form submission. There
   is **no webhook URL to paste into the Netlify UI, and no notification to
   add**. This was chosen deliberately over the outgoing-webhook route: it is
   one fewer dashboard setting that can be switched off by accident, and there
   is no URL to go stale. Renaming this file breaks it. Do not rename it.

   FAILURE POLICY. Netlify has already stored the submission before this
   function runs. Nothing here can affect that, and nothing here may try.
   Every path returns 200 and logs. **This function never throws.** A broken
   email must never look like a broken form.

   DEPENDENCIES: none. Resend is called with plain `fetch`, which Node has had
   built in since 18. Nothing to install, nothing to keep updated, no lockfile
   entry that can drift. One less thing to break.

   ENVIRONMENT: `RESEND_API_KEY` is the only value that MUST be set. Everything
   else has a working default in the constants below. Set it at
   Netlify → Site configuration → Environment variables → Add a variable.
   =========================================================================== */

import { business } from '../../src/data/business.ts';

/* ---------------------------------------------------------------------------
   THE CONSULTATION FEE LIVES HERE AND NOWHERE ELSE.

   Changing the fee is this one line. It is permitted in this file because
   transactional email to someone who has already filled in the qualification
   form is not the public website. **It must never appear on any page of the
   site, including /contact/thank-you.** See DESIGN_BRIEF.md §5.9 and
   CLAUDE.md's 2026-08-05 entry.
   --------------------------------------------------------------------------- */
const CONSULTATION_FEE = '$125';

/* ---------------------------------------------------------------------------
   Addresses. Not secrets, so they live in code where they can be reviewed
   rather than in a dashboard where they cannot. Each can still be overridden
   with an environment variable without a code change.

   TODO (Sam): neither mailbox exists yet — LAUNCH_CHECKLIST.md §1. The `from`
   address must be on a domain verified inside Resend or Resend will reject
   the send.
   --------------------------------------------------------------------------- */
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || 'Amy K Clark Design <hello@amykclarkdesign.com>';
const AMY_ADDRESS = process.env.AMY_NOTIFICATION_EMAIL || 'hello@amykclarkdesign.com';

/* Amy's private appointment-scheduling URL.

   **Imported from src/data/business.ts on purpose — there is exactly one copy
   of this value in the repo.** An environment variable would have been easier
   to bundle, and was rejected: it would mean two places to set the same URL,
   and the failure mode is someone setting one and not the other and never
   finding out. Netlify bundles functions with esbuild, which reads TypeScript
   directly, so this import costs nothing.

   **Empty is the correct default.** When empty, the booking line is omitted
   from Amy's draft entirely rather than left blank. See the long comment in
   business.ts for why this URL is never public. */
const BOOKING_URL = business.bookingUrl || '';

/* Gmail and Apple Mail both truncate or refuse very long mailto: URLs. 1900
   is the working ceiling for the WHOLE encoded URL, not just the body. */
const MAILTO_MAX = 1900;

/* ===========================================================================
   TEMPLATE 1 of 2 — THE EMAIL THE CLIENT RECEIVES, IMMEDIATELY
   ===========================================================================
   DRAFT COPY - NEEDS REWRITE

   **This is the only place the client-facing reply text lives.** Editing this
   string changes what every person who submits the form receives. There is no
   second copy anywhere.

   The consultation fee appears here, via CONSULTATION_FEE above.

   DELIBERATELY ABSENT, and must stay absent — an automated message cannot know
   any of these, and each goes stale within weeks:
     - any specific availability window
     - any installation or fabrication lead time
     - any booking link
   Availability is Amy's to state by hand, in her own reply. That is the whole
   design.
   =========================================================================== */
const CLIENT_EMAIL_TEMPLATE = ({ name }) => `Hi ${name},

Thank you for reaching out about your windows. Your inquiry has arrived and Amy has it.

She reads each of these herself, and she will follow up with you personally about your room.

If it looks like a fit, the next step is an in-home design consultation. It runs about an hour and a half. Amy brings hardware, fabric, sheer options, and anything else you would like to see, so you can hold the real thing against your own walls in your own light. The consultation fee is ${CONSULTATION_FEE}.

Talk soon,

Amy K Clark Design
Custom drapery, blinds and shades, upholstery, and soft furnishings
Cincinnati and Northern Kentucky`;

/* ===========================================================================
   TEMPLATE 2 of 2 — THE REPLY DRAFT AMY SENDS
   ===========================================================================
   DRAFT COPY - NEEDS REWRITE

   This is the body of the mailto: link in Amy's notification. Clicking it
   opens her mail client with this already written, addressed, and personalised.
   She edits and sends.

   No LLM generates any of this. It is a merge, so it cannot invent a promise
   to a client.

   Two things are conditional:
     - `availabilityLine` is always present and always a placeholder. Amy fills
       it in or deletes it. Availability never becomes automatic.
     - `bookingLine` appears ONLY when BOOKING_URL is set. When it is empty the
       line is removed cleanly, leaving no gap and no dangling sentence.
   =========================================================================== */
const AMY_REPLY_TEMPLATE = ({ firstName, quotedRoom, availabilityLine, bookingLine }) =>
  `Hi ${firstName},

Thank you for getting in touch, and for the detail about your room. Here is what you told me:

"${quotedRoom}"

I would like to come and see it. The in-home consultation runs about an hour and a half, and I bring hardware, fabric, and sheer options so you can see everything against your own light.

${availabilityLine}${bookingLine}Amy
Amy K Clark Design`;

/* The placeholder Amy fills in or deletes. Deliberately shouty so it can never
   be sent by accident. */
const AVAILABILITY_PLACEHOLDER =
  '[[ AVAILABILITY - fill in the times you can offer, or delete this line ]]\n';

/* ------------------------------------------------------------------------ */

/* Fields in the order Amy should read them. Budget is pulled to the top
   because it is the field that decides whether she takes the job. Anything
   submitted that is not on this list is still printed, under "Other", so a new
   form field can never go missing from her email. */
const FIELD_ORDER = [
  ['budget', 'Budget'],
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['location', 'Location'],
  ['project-type', 'Project type'],
  ['timeline', 'Timeline'],
  ['room', 'About the room'],
  ['existing-colors', 'What else is in the room'],
  ['about-you', 'About them'],
  ['referral', 'How they heard'],
];

const IGNORED_FIELDS = new Set(['bot-field', 'form-name', 'photos']);

const escapeHtml = (v) =>
  String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* Deliberately permissive. This decides only whether we ATTEMPT the client
   email; a false negative costs someone their confirmation, so anything with
   a plausible shape is allowed through and Resend makes the real judgement. */
const looksLikeEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const asText = (v) => (Array.isArray(v) ? v.join(', ') : v == null ? '' : String(v)).trim();

/* Build the mailto: URL, keeping the WHOLE thing under MAILTO_MAX.
   The template is never cut. Only the client's own quoted words are, and only
   as much as needed, with an ellipsis so Amy can see it happened. */
function buildMailto({ to, subject, firstName, room, availabilityLine, bookingLine }) {
  const assemble = (quoted) =>
    `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      AMY_REPLY_TEMPLATE({ firstName, quotedRoom: quoted, availabilityLine, bookingLine })
    )}`;

  let url = assemble(room);
  if (url.length <= MAILTO_MAX) return { url, truncated: false, length: url.length };

  /* Shrink the quote until it fits. Binary search rather than a loop of one
     character at a time, because percent-encoding means removing one character
     can free between 1 and 9 bytes and a linear walk is needlessly slow. */
  let lo = 0;
  let hi = room.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (assemble(room.slice(0, mid) + '...').length <= MAILTO_MAX) lo = mid;
    else hi = mid - 1;
  }
  url = assemble(room.slice(0, lo) + '...');

  /* Pathological case: even an empty quote does not fit, which would mean the
     template itself grew past the cap. Send with no quote at all rather than a
     broken link, and log loudly so it gets noticed. */
  if (url.length > MAILTO_MAX) {
    console.error(
      `[submission-created] TEMPLATE TOO LONG: mailto is ${url.length} chars with an empty quote. ` +
        `Shorten AMY_REPLY_TEMPLATE. Cap is ${MAILTO_MAX}.`
    );
    url = assemble('');
  }
  return { url, truncated: true, length: url.length };
}

async function sendEmail(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('[submission-created] RESEND_API_KEY is not set. No email sent.');
    return false;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error(`[submission-created] Resend rejected the send: ${res.status} ${await res.text()}`);
    return false;
  }
  return true;
}

export const handler = async (event) => {
  /* One try/catch around everything. Nothing below is allowed to escape. */
  try {
    const body = JSON.parse(event.body || '{}');
    const submission = body.payload || {};
    const data = submission.data || {};

    /* Honeypot. Netlify usually filters these before we are called at all, so
       this is the second line of defence rather than the first. */
    if (asText(data['bot-field'])) {
      console.log('[submission-created] Honeypot tripped. No email sent.');
      return { statusCode: 200, body: 'ok' };
    }

    const name = asText(data.name) || 'there';
    const firstName = name.split(/\s+/)[0];
    const email = asText(data.email);
    const room = asText(data.room);
    const budget = asText(data.budget) || 'Not given';

    /* ---- Email 2: to Amy. Sent whether or not the client address is usable,
       because a submission Amy never sees is the real failure. ---- */
    const seen = new Set(IGNORED_FIELDS);
    const rows = [];
    for (const [key, label] of FIELD_ORDER) {
      seen.add(key);
      const value = asText(data[key]);
      if (value) rows.push([label, value]);
    }
    for (const [key, value] of Object.entries(data)) {
      if (seen.has(key)) continue;
      const v = asText(value);
      if (v) rows.push([`Other: ${key}`, v]);
    }

    const availabilityLine = AVAILABILITY_PLACEHOLDER;
    /* The whole line vanishes when there is no booking URL. No empty
       placeholder, no orphaned sentence. */
    const bookingLine = BOOKING_URL ? `\nYou can pick a time here: ${BOOKING_URL}\n\n` : '\n';

    let mailto = null;
    if (looksLikeEmail(email)) {
      mailto = buildMailto({
        to: email.trim(),
        subject: 'About your windows',
        firstName,
        room: room || 'your room',
        availabilityLine,
        bookingLine,
      });
      console.log(
        `[submission-created] mailto built: ${mailto.length} chars (cap ${MAILTO_MAX})` +
          `${mailto.truncated ? ', client quote truncated to fit' : ''}`
      );
    }

    const rowsHtml = rows
      .map(
        ([label, value]) =>
          `<tr>
             <td style="padding:6px 16px 6px 0;vertical-align:top;color:#6E6E68;white-space:nowrap;font:12px -apple-system,Segoe UI,Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(
               label
             )}</td>
             <td style="padding:6px 0;vertical-align:top;font:15px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#191917;">${escapeHtml(
               value
             ).replace(/\n/g, '<br>')}</td>
           </tr>`
      )
      .join('');

    const amyHtml = `<div style="max-width:640px;margin:0 auto;padding:24px;">
  <p style="font:12px -apple-system,Segoe UI,Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:.18em;color:#6E6E68;margin:0 0 4px;">New consultation request</p>
  <h1 style="font:24px/1.2 Georgia,serif;color:#191917;margin:0 0 4px;">${escapeHtml(name)}</h1>
  <p style="font:18px/1.3 Georgia,serif;color:#191917;margin:0 0 24px;"><strong>Budget: ${escapeHtml(
    budget
  )}</strong></p>
  ${
    mailto
      ? `<p style="margin:0 0 28px;">
           <a href="${escapeHtml(mailto.url)}"
              style="display:inline-block;background:#191917;color:#F1F1EF;text-decoration:none;padding:14px 22px;font:12px -apple-system,Segoe UI,Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:.14em;">
             Reply to ${escapeHtml(firstName)}
           </a>
         </p>
         <p style="font:13px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#6E6E68;margin:-18px 0 28px;">
           Opens a reply that is already written. Fill in your times, or delete that line, and send.
         </p>`
      : `<p style="font:14px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#191917;background:#F1F1EF;padding:12px 16px;margin:0 0 28px;">
           No usable email address was submitted, so there is no one-click reply for this one.${
             asText(data.phone) ? ` They left a phone number: ${escapeHtml(asText(data.phone))}` : ''
           }
         </p>`
  }
  <table style="border-collapse:collapse;width:100%;">${rowsHtml}</table>
  <p style="font:13px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#6E6E68;margin:28px 0 0;border-top:1px solid #D6D6D1;padding-top:16px;">
    Any photographs they attached are on the submission in Netlify, not in this email.
  </p>
</div>`;

    const amyText = [
      'NEW CONSULTATION REQUEST',
      '',
      `Budget: ${budget}`,
      '',
      ...rows.map(([label, value]) => `${label}: ${value}`),
      '',
      mailto ? `One-click reply: ${mailto.url}` : 'No usable email address was submitted.',
      '',
      'Photographs, if any, are on the submission in Netlify.',
    ].join('\n');

    const amySent = await sendEmail({
      from: FROM_ADDRESS,
      to: [AMY_ADDRESS],
      /* So a plain "Reply" in her mail client also reaches the client. */
      reply_to: looksLikeEmail(email) ? email.trim() : undefined,
      subject: `New consultation request — ${name} — ${budget}`,
      html: amyHtml,
      text: amyText,
    });
    console.log(`[submission-created] Amy notification: ${amySent ? 'sent' : 'FAILED'}`);

    /* ---- Email 1: to the client. Skipped, not fatal, if the address is
       missing or malformed. Amy's email above has already gone. ---- */
    if (!looksLikeEmail(email)) {
      console.warn(
        `[submission-created] No usable client email (${JSON.stringify(email)}). ` +
          'Client confirmation skipped; Amy notification was still sent.'
      );
      return { statusCode: 200, body: 'ok' };
    }

    const clientText = CLIENT_EMAIL_TEMPLATE({ name: firstName });
    const clientSent = await sendEmail({
      from: FROM_ADDRESS,
      to: [email.trim()],
      reply_to: AMY_ADDRESS,
      subject: 'Amy K Clark Design — we have your inquiry',
      text: clientText,
      html: `<div style="max-width:560px;margin:0 auto;padding:24px;font:16px/1.65 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#191917;">${clientText
        .split('\n\n')
        .map((p) => `<p style="margin:0 0 18px;">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
        .join('')}</div>`,
    });
    console.log(`[submission-created] Client confirmation: ${clientSent ? 'sent' : 'FAILED'}`);

    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    /* The submission is already saved. Log and return success. */
    console.error('[submission-created] Unhandled error, submission is unaffected:', err);
    return { statusCode: 200, body: 'ok' };
  }
};
