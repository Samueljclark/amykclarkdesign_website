# Moving the website to Amy's own Netlify account

Written 2026-10-12 during the POLISH-AND-AUDIT-V2 site audit. Nothing has been
transferred. This is the plan, in plain English.

## Where things stand today

- **Netlify** is the company that hosts amykclarkdesign.com: it builds the site,
  serves it, receives the contact form, and runs the small program that sends
  the two confirmation emails.
- The site lives in a Netlify **team called "Boston College"**, on a **free
  plan**, and **Sam's account is the only owner**. Amy has no login to it.
- On the free plan the team gets a monthly allowance of build credits (300 at
  the time of writing). When the allowance runs out, **Netlify stops publishing
  changes** until the next month. This already happened once: four updates in
  late August 2026 were skipped with "account credit usage exceeded".
- The **domain** (amykclarkdesign.com) is registered at **GoDaddy**. GoDaddy
  points the address at Netlify. That part does not change in a transfer.
- The **code** lives on GitHub under Sam's account
  (`Samueljclark/amykclarkdesign_website`). Netlify rebuilds the site whenever
  that code changes.

## Why move it

The business should own its own website. Right now Amy depends on Sam's
personal account staying active and in good standing, and she cannot see her
own form submissions in Netlify, change who gets notified, or fix anything if
Sam is unavailable.

## What Amy has to do herself (these need her, not Sam)

1. **Create a Netlify account** at netlify.com with the email address she wants
   the business to use. Use a strong password and turn on two-step
   verification. No one else should create this for her.
2. **Create a team** in that account (Netlify will offer one when she signs up)
   and name it something like "Amy K Clark Design". The free plan is fine to
   start.
3. **Invite Sam to her team** (Team settings, Members, Invite) with a role that
   can add and manage projects, so he can move the site in.
4. Later, once everything works: decide whether Sam stays on her team as a
   helper or is removed.

## What Sam does (after he accepts Amy's invitation)

1. **Write down the environment variables first, including where each one
   lives.** The site needs `RESEND_API_KEY` for the confirmation emails. Today
   the variables are stored at the **team** level of the "Boston College" team,
   and **team-level variables do not travel with a site**. They have to be
   re-created on Amy's team (or on the site itself) after the move. See the
   audit report for a problem with how the email key is stored right now; fix
   that at the same time.
2. In Netlify, open the site, go to the site's settings, find the transfer
   option (in the "danger zone" area at the bottom), and **transfer the project
   to Amy's team**.
3. **Re-create the environment variables** on the site under Amy's team, then
   trigger a fresh deploy so the email program picks them up.
4. **Check the Git connection.** The site rebuilds from Sam's GitHub repository
   through Netlify's GitHub app. After the move, confirm a push to `main` still
   starts a build. If it does not, relink the repository from the site's
   build settings (Sam will need to approve the GitHub app for Amy's team).
5. **Check the form settings.** The contact form, its past submissions, and its
   email notification move with the site. Confirm the notification goes to
   the inbox Amy actually reads.
6. **Check the domain.** It should keep working without changes, because
   GoDaddy points at the site's Netlify address and that address does not
   change in a transfer. Load amykclarkdesign.com and www.amykclarkdesign.com,
   and confirm the padlock (HTTPS) is still valid.
7. **Send one test inquiry** and confirm both emails arrive.

## Optional, later

- **GitHub:** the code can also be moved into an account Amy controls, or Amy
  can be added to the repository. Not required for the website to keep working.
- **Resend** (the email-sending service) should also end up in an account Amy
  owns, for the same reasons.
- **GoDaddy:** confirm the domain is registered to Amy, with her email on file,
  so renewal notices reach her.

## What breaks if nobody does this

Nothing breaks today. The site keeps working as long as Sam's account does.
The risks are:

- **Builds stop whenever the monthly allowance runs out**, and the warnings go
  to Sam, not Amy.
- If Sam's account is closed, loses access, or is cleaned up, **the website goes
  offline** and Amy has no way in to restore it.
- Amy cannot see or export her own contact-form submissions in Netlify, or
  change where notifications go.
