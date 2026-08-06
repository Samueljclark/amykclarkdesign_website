# The contact form, and the two emails it sends

**Written 5 August 2026. For Amy, and for anyone who has to look after this
after Sam leaves for college.**

You should not need to write code to understand this page, and you should not
need to write code to fix most of what can go wrong with it. Where something
genuinely does need a developer, it says so plainly.

---

## What happens when someone fills in the form

Someone finds the site, reads a bit, and fills in the consultation form on
**amykclarkdesign.com/contact**. They give their name, email, where they live,
what room they are thinking about, a budget band, and optionally some
photographs.

The moment they press the button, four things happen, in this order:

**1. Netlify saves the submission.**
Netlify is the company that hosts the website. Their system stores every
submission permanently, before anything else happens. **This is the copy that
matters.** Even if every email below fails, the enquiry is safe and you can
read it. Nothing described further down can lose it.

**2. They land on a thank-you page.**
A short page confirming it arrived. It deliberately says nothing about price,
availability, or how long anything takes.

**3. They get a confirmation email, within seconds.**
It tells them the enquiry arrived, that Amy will follow up personally, what she
brings to a consultation (hardware, fabric, sheer options, and anything else
they would like to see), that the visit runs about an hour and a half, and what
the consultation fee is.

It deliberately does **not** say when Amy is free, how long anything takes to
make, or contain a booking link. An automatic email cannot know those things,
and a wrong answer sent automatically is worse than no answer.

**4. Amy gets a different email — the important one.**
This is the one built to save time. It contains:

- Everything they submitted, laid out to be read quickly.
- **Their budget band at the top**, in large type, because that is usually the
  thing that decides whether it is worth a visit.
- **A big dark button that says "Reply to [their name]".**

**Clicking that button opens your normal email program with the reply already
written.** Their address is filled in, the subject is filled in, and the
message already says hello to them by name and quotes back what they told you
about their room. You read it, change anything you want, and press send.

There is one line in the middle in double square brackets, like this:

```
[[ AVAILABILITY - fill in the times you can offer, or delete this line ]]
```

That is the one thing you have to do by hand. Type the times you can offer, or
delete the line. It is written in an obvious way so it can never be sent by
accident.

> **Nothing in this system is written by an AI.** Amy's reply is a fixed
> template with the client's own name and words dropped into it. It cannot
> invent a promise, quote a price, or offer a date you did not offer. If you
> want it to say something different, someone changes the template once and it
> says that from then on.

---

## Where to read the submissions

**app.netlify.com → the site → Forms → `consultation`.**

Every enquiry ever submitted is there, including any photographs. **The
photographs are only here — they are not attached to the emails.** If someone
mentions a photo they sent, this is where to look.

Log in with the account the site is hosted under.

---

## Where the words live, and how to change the fee

Both emails are written in one file:

```
netlify/functions/submission-created.js
```

Inside it, near the top, are three things, each with a big comment above it
saying what it is:

| What | Called | What it is |
|---|---|---|
| The fee | `CONSULTATION_FEE` | The consultation fee. **One line.** |
| Email to the client | `CLIENT_EMAIL_TEMPLATE` | The confirmation they receive |
| Amy's reply draft | `AMY_REPLY_TEMPLATE` | What the "Reply" button writes |

**To change the fee, change `CONSULTATION_FEE`.** It appears in exactly one
place in the whole project, so that one edit changes it everywhere it is ever
shown. Do not type the figure anywhere else.

⚠️ **The fee is allowed in these emails. It is not allowed on the website.**
That is a deliberate rule, not an oversight. The website never shows a price,
because Amy does not want to be shopped on price by people who have not spoken
to her. Someone who has filled in the form has already asked, so telling them
is helpful rather than a shop window. **The fee must never be added to any page
of the site, including the thank-you page.**

Changing any of this needs someone comfortable editing a file and pushing it to
GitHub. It is a small change, but it is a code change.

---

## The booking link, and why it is not on the website

Amy's booking link is **a Google Calendar appointment schedule on her own
Google account.** Google was chosen over the alternatives for one reason: she
already uses Google every day. It writes to her real calendar, and she can
change her own availability herself, in an app she already knows, without
anyone touching code.

**The booking link is deliberately not on the website anywhere.** This is the
single most likely thing for a future helper to "fix" by mistake, so here is
the reasoning:

If a booking link were on the site, anyone could take a slot in Amy's calendar
— including people out of her area, people with a budget that does not work,
and people who are not really going to go ahead. Her time is the scarce thing
in this business. The form exists to filter, and a public calendar would walk
straight around the filter.

So the order is: **someone fills in the form → Amy reads it → Amy decides →
Amy sends the booking link only to the people she wants to see.** The link is
built into her reply draft automatically, so it costs her nothing.

Until the Google schedule exists, that line is simply left out of the reply. It
does not appear as a blank space or a broken sentence — it is just not there.

**To turn it on:** put the URL into `bookingUrl` in `src/data/business.ts`.
That is the only place it goes. It must never be added to a page.

---

## If replies stop arriving, check these in order

**Start here. The first two cover almost every case.**

**1. Is the enquiry in Netlify at all?**
**Netlify → Forms → `consultation`.**
- **If it is there** — the form is fine. The problem is only email. Go to 2.
- **If it is not there** — the form itself is not reaching Netlify, which is
  more serious. Go to 4.

**2. Check the email is not in spam.**
Both emails are sent by a service called **Resend**. New sending domains get
treated with suspicion for a while. Check junk, and mark as not-junk.

**3. Look at the function's log.**
**Netlify → Logs → Functions → `submission-created`.**
This is the honest record of what happened. You are looking for a line saying
`Amy notification: sent`, or an error explaining why not.

The most common cause is a line reading **`RESEND_API_KEY is not set`**. That
means the key that lets the site send email is missing or expired. Fix it at
**Netlify → Site configuration → Environment variables**. The key comes from
resend.com.

⚠️ **A missing key looks like silence, not like an error.** Nothing breaks, no
warning appears, and the enquiry is still saved. The emails simply do not
arrive. That is why this log is the thing to check.

**4. If submissions are not reaching Netlify at all.**
Check **Netlify → Site configuration → Forms → Form detection** is enabled, and
that the site has been redeployed since it was enabled. Detection happens when
the site is built, so switching it on does not fix past deploys on its own.

Beyond this point it needs a developer. Two things in the code are load-bearing
and are both clearly commented as such: a hidden field called `form-name`, and
an attribute called `data-astro-reload`. If either is removed, the form looks
completely normal and silently stops working.

---

## What is deliberately manual, and should stay that way

Two things are never automatic, by design:

**Availability.** No email, page, or automatic message ever states when Amy is
free. Availability lives in her calendar and in whatever she types into a
reply. Automating it means a message that is wrong the week after it is
written, sent to a client, in her name.

**Installation and fabrication lead times.** Same reasoning, more so. These
depend on the fabric, the supplier, and how busy the workroom is. A number in
an automatic email becomes a promise nobody agreed to.

If either ever seems worth automating, the question to ask first is: *what
happens the first week this is wrong, and who has to apologise?*

---

## The short version

- Netlify stores every enquiry. That copy is safe regardless of email.
- The client gets a confirmation. Amy gets a one-click reply.
- The fee is in one place: `CONSULTATION_FEE`.
- The booking link is private on purpose. Do not put it on the site.
- If emails stop: check Netlify Forms, then spam, then the function log.
- Availability and lead times stay manual, forever.
