COPY-PASS-V1: Kristen copy pass, hover fix, auto-scroll restore, Studio update
Instructions for Claude Code. This file is self-contained. It lives at the repo root of amykclarkdesign_website. Work through the tasks in order. Each task has a verify block; do not commit a task until its verify block passes.
The site is LIVE at amykclarkdesign.com. Do not deploy to production in this session. The last task is a draft deploy for review.
Ground rules (binding for this session)
Read CLAUDE.md, DESIGN_BRIEF.md, and SITE-COPY-REWRITE.md before touching anything.
The copy in the Appendix has already been checked against the site's rules. Use it verbatim. Do not tighten, reword, or "improve" it. Match the site's existing apostrophe and quote style.
If you find a rule violation in the Appendix copy that was missed (banned word from the list in CLAUDE.md, em dash, en dash, ampersand, vendor positioning, a price or dollar amount, location wording other than "Cincinnati and Northern Kentucky"), do NOT fix it yourself. Leave it and list it in the final report.
Brand name is "Amy K Clark Design" with no period, everywhere. (Amy's personal name may appear as "Amy K. Clark".)
Any prose you write yourself that is not in this file gets a DRAFT COPY - NEEDS REWRITE code comment and is listed in the final report. Remove existing DRAFT COPY - NEEDS REWRITE markers from sections that are fully replaced by Appendix copy.
Hide, do not delete. Anything removed from view goes behind a feature flag or is commented out, using the same pattern as the existing portfolio flag.
For anything interactive, verify in a real browser (Playwright) with screenshots. Code reasoning alone is not verification on this project; the hamburger menu bug was only found and confirmed by browser reproduction.
Work on a new branch copy-pass-v1. Do not push to main.
Every interactive script (Tasks 2, 4, and 5) must initialize on astro:page-load (not DOMContentLoaded, not top-level module code that runs once), be idempotent (no duplicate listeners after repeated navigation), query the DOM fresh each time, and clean up its listeners when the page is swapped out. The site uses Astro view transitions sitewide.
Task 0: Session setup
Check .claude/settings.json. If the model is not pinned to Sonnet, pin it and say so in the report (it takes effect next session).
git pull, confirm a clean working tree, create branch copy-pass-v1.
Run npm run build and confirm it passes before any changes.
Determine the current deploy situation: are Git-triggered Netlify deploys working again, or is the CLI still the only working path (npm run build && netlify deploy --prod --dir=dist)? Check netlify status and the most recent deploys. Report what you find. Do not deploy yet.
Verify: clean build on the new branch, deploy situation recorded.
Task 1: Hide Blinds and Design Journal (saved for v2)
Put /blinds and /journal (including any /journal/* posts) behind feature flags so they are not built.
Remove every link to them: desktop header nav, mobile menu, footer "Site" list, and any in-page links (check the service list items on Home and Services for links to /blinds).
Add 301 redirects (in public/_redirects or netlify.toml, whichever the repo already uses):
/blinds and /blinds/ → /services
/journal, /journal/, and /journal/* → /
If a sitemap is generated, confirm both are gone from it.
Resulting nav, in order: Services, About, Process, Contact.
Verify:
dist/ contains no blinds or journal page output.
Searching dist/ for /blinds and /journal finds only the redirect rules.
Browser screenshots of the header at 1440px and the open mobile menu at 390px show exactly four nav items. Footer shows the same four.
Commit: Hide Blinds and Design Journal for v2; 301 redirects to Services and Home
Task 2 (PRIORITY): Fix the service hover image swap on Home
Context: the four-item service list on Home (Custom Drapery, Blinds and Shades, Upholstery, Soft Furnishings) swaps the image on the right when you hover an item. This is the feature Sam cares about most. Do not mark this task done until it is browser-verified across the full matrix.
Current state: it WORKS on Reaghan's Mac and does NOT work on Sam's Mac (MacBook Pro, M4 Pro, sometimes driving an external monitor over HDMI). Both are Macs, so the cause is most likely a difference in browser or browser version, an accessibility setting (macOS Reduce Motion sets prefers-reduced-motion: reduce), window width hitting a breakpoint, cached assets, or how the page was reached (direct load vs. view-transition navigation). The hamburger menu broke earlier for that last reason.
If this session is running on Sam's Mac, collect these facts first and report them:
defaults read com.apple.universalaccess reduceMotion (1 means Reduce Motion is on; if the command is blocked, say so)
Installed browsers and their versions (Safari, Chrome, and any others)
Reproduce BEFORE changing code, in a real browser. Record pass or fail for each: a. Direct load of /, then hover each item. b. Load /process, click the site logo to go Home (view-transition navigation), then hover each item. c. / → click to another page → click back to /, then hover. d. (a) and (b) with prefers-reduced-motion: reduce emulated. e. (a) at viewport widths 1024, 1280, 1440, 1512, 1728, 1920, and 2560. Note any width where the swap is disabled or the layout changes so the image column disappears. f. Touch emulation (hover: none, pointer: coarse): tap each item. g. Keyboard: Tab to each item. h. Run (a) through (e) in both Chromium and WebKit (WebKit stands in for Safari).
Check git log for changes to this component and any shared scripts in the last three weeks. A regression from a recent deploy is possible.
Fix the root cause. Required behavior after the fix:
Works in every case in the matrix.
Meets ground rule 9.
Reduced motion disables only the crossfade animation. The swap itself must still happen.
Works on hover, keyboard focus, and tap.
Re-run the full matrix after the fix and save screenshots of the swapped state.
If you cannot reproduce the failure in any case, still harden the code to the requirements above, and give Sam a four-line checklist to run on his Mac (which browser, private window, Reduce Motion on vs. off, window width) so the failing condition can be pinned down.
Verify: full matrix passes after the fix. Root cause stated in one or two sentences in the report.
Commit: Fix service hover image swap across view-transition navigation, reduced motion, widths, touch, and keyboard
Task 3: Home page copy
Under the hero, the line "Amy K Clark Design" is followed by three links: Upholstery, Drapery, Shades. Remove the three links. Keep the "Amy K Clark Design" line. Below it, add this as plain text (not a link), using the site's existing small subhead style:
Boutique custom window treatment and upholstery studio serving Cincinnati and Northern Kentucky.
In the service list, the Blinds and Shades blurb currently reads: "Blinds, shades, shutters, and woven woods from the one line she represents, chosen for privacy, light, and finish." That positions Amy as a vendor's representative, which violates the vendor rule. Replace it with:
Blinds, shades, shutters, and woven woods, made to order and chosen for privacy, light, and finish.
This replacement is Claude-written. Add the DRAFT COPY - NEEDS REWRITE comment and list it in the report.
Nothing else on Home's copy changes.
Verify: screenshots of the hero area and service list at 1440px and 390px; hover swap from Task 2 still works.
Commit: Home: replace hero service links with studio tagline; fix Blinds blurb vendor language
Task 4: Restore the first-scroll auto-advance on Home
Context: the Home page used to have a feature where the first light scroll down from the hero smoothly scrolled the page to the next section on its own. It only happened the first time, and only on the Home page. It has since been removed. Sam wants it back.
Find it in git history. Search with git log -S and git log -G for terms such as scrollIntoView, scrollTo, wheel, snap, auto-scroll, autoscroll, and hero. Identify the commit that added it and the commit that removed it. Read the removal commit's message and diff. If it was removed to fix a bug, the restored version must not reintroduce that bug. Report both commit hashes and the reason it was removed.
Restore it with these rules:
Home page only.
Triggers only when the page is at the top (viewing the hero) and the user makes a small downward scroll with a wheel or trackpad. Match the original's behavior on touch devices; if the original was desktop-only, keep it desktop-only.
Smoothly scrolls to the top of the next section, then hands control straight back to the user.
Fires once per browser session: it does not fire again when the user returns to Home in the same session. Use sessionStorage, wrapped in try/catch; if storage is unavailable, fall back to once per page load.
Ignores further wheel and touch input while the animation runs, so Mac trackpad momentum does not fight it or overshoot past the next section.
Never fires if the page loads already scrolled (refresh mid-page, back button, or a #hash link).
Skipped entirely under prefers-reduced-motion: reduce. If Task 2 found Reduce Motion on for Sam's Mac, say clearly in the report that he will not see this feature on his machine until it is turned off.
Meets ground rule 9.
Verify in a real browser:
Direct load of /, one small wheel tick down → lands at the top of the next section.
The next scroll after that behaves normally.
Navigate away and back to / → does not fire again.
Reload while scrolled halfway down → does not fire.
Reduced motion emulated → does not fire.
Simulated trackpad momentum (a burst of small wheel events) → lands on the next section without overshooting or stuttering.
390px with touch emulation → behaves as the original did, or is cleanly skipped. Report which.
The Task 2 hover swap still works after the auto-advance has fired.
Commit: Home: restore one-time first-scroll auto-advance from hero
Task 5: Services page (new layout plus Appendix copy)
Replace the current Services page body (the intro paragraph, the duplicate "Services" H2, and the hover list) with the Services copy from the Appendix, in this layout. (The Home page keeps its hover list. On Services, the long copy needs a scroll-driven version of the same image-swap idea.)
Desktop:
Two columns. Left column holds all copy, left-aligned, starting with the H1 "Services".
Right column holds a single sticky image. Its top edge aligns with the top of the "Services" H1 (this is Kristen's "shift image up to align with Services" note).
As each section scrolls into view, the sticky image crossfades to that section's image (use IntersectionObserver). Mapping, using images already in the repo:
Intro and Custom Drapery → pinch-pleat drapery header rings image
Blinds, Shades, and Shutters → white wood blinds bay window image
Upholstery → houndstooth reupholstered dining chair image
Soft Furnishings → botanical cushions on rattan counter stools image
The Amy K Clark Design Difference → stays on the soft furnishings image
Tighten the vertical gap between the intro block and the "Custom Drapery" heading (Kristen's note).
Mobile (below the site's existing breakpoint):
No sticky column. Each service section shows its own image inline, above its heading.
Typography: section headings use the existing H2 style. The single line directly under each heading uses the site's existing lede or subhead style. Do not invent new type styles.
Robustness: meets ground rule 9; reduced motion disables only the fade, never the swap. Share code with the Task 2 fix if it fits cleanly.
Verify:
Desktop screenshots at 1280px and 1440px: top of page (image top aligned with H1), Upholstery in view (image shows the chair), bottom of page.
390px screenshots showing inline images.
Scroll-swap works on direct load of /services AND after arriving via the nav from another page, in Chromium and WebKit.
Commit: Services: Kristen copy, sticky scroll-synced image, alignment fixes
Task 6: About page (Kristen copy plus Studio with Reaghan)
Page order, top to bottom: a. Amy's headshot plus the About copy from the Appendix. Headshot left, copy right on desktop (use the site's existing two-column pattern); headshot above copy on mobile. b. The Studio section. c. The existing "Let's Get Started" CTA band.
Hide (flag or comment out, do not delete): the ivory drapery bay-window image (it moves to the Process page in Task 7), the workroom stitching close-up, and all current About body text.
Studio section: keep it. This overrides Kristen's "headshot only" note, at Sam's direction.
Remove Amy's card from the Studio section, since her headshot now leads the page and the same photo should not appear twice. Keep the Sam and Kelsee cards exactly as they are. Kelsee's photo credit lives here, so her card must stay.
Add a card for Reaghan Connelly, after Sam's card:
Name: Reaghan Connelly
Title: a single constant, currently an empty string. Sam will supply it.
Photo: not available yet. Sam will add it within a few days. Expected location: alongside the existing Studio photos, named reaghan-connelly.jpg (match the folder and naming convention the existing Studio photos use, and give Sam the exact path in the report).
The card renders only when BOTH the photo file exists AND the title constant is non-empty. Use a build-time check (for example import.meta.glob) so that adding the photo, setting the title, and rebuilding is all it takes. Until then the Studio section shows the Sam and Kelsee cards only: no empty slot, no placeholder, no broken image.
Alt text when it renders follows the existing cards' pattern: "Reaghan Connelly, [title]".
Verify the grid looks right both with two cards and with three. Test the three-card state with a temporary placeholder image and title, then remove both before committing.
Keep the page <title> and meta description unchanged.
Verify: screenshots at 1440px and 390px in the current two-card state, plus the temporary three-card test state.
Commit: About: headshot plus Kristen copy; Studio keeps Sam and Kelsee, adds Reaghan card gated on photo and title
Task 7: Process page
Remove the close-up stitching image.
Replace the page copy with the Process copy from the Appendix. Four steps replace the current five. Keep the existing numbered-step component and styling (01, 02, 03, 04). Keep the small "Process" eyebrow label above the H1.
Layout: copy on the left, one image on the right. Use the "ivory drapery and white wood blinds dressing three bay windows in a breakfast room" image (freed up by the About change). On mobile, image above the copy.
Closing section: heading and paragraph from the Appendix, then the existing sitewide CTA button "Schedule your complimentary discovery call" linking to /contact. Kristen's draft labeled this button as a "consultation", but the consultation is the paid visit, so use the existing discovery-call label. This closing section replaces "Let's Get Started" on this page only.
The meta description currently says "Amy carries all five steps", which is now wrong. Replace it with the line below. It is Claude-written: add the marker and list it in the report.
How a project with Amy K Clark Design runs: a complimentary discovery call, an in-home design consultation, refining the details, and fabrication and installation.
Verify: screenshots at 1440px and 390px; view source confirms the new meta description.
Commit: Process: Kristen copy, four steps, new image, discovery-call CTA
Task 8: Contact page
Replace the intro (the H1 and the three paragraphs above the form) with the Contact intro from the Appendix. Keep the small "Contact" eyebrow label, the page <title>, and the meta description.
Leave the form exactly as is, including its "Start a project" heading and the paid-appointment note under it.
Replace the existing "Common questions" section with the Common Questions copy from the Appendix. Keep the current FAQ markup and styling pattern. If the page has FAQPage JSON-LD, update it so every question and answer matches the new visible text exactly.
The closing "Still Wondering If Your Project Is a Fit?" block gets the existing button "Schedule your complimentary discovery call". On this page it scrolls to the form (in-page anchor), not a reload of /contact.
Verify: screenshots at 1440px and 390px; the closing button scrolls to the form; JSON-LD (if present) validates and matches.
Commit: Contact: Kristen intro and Common Questions; closing CTA anchors to form
Task 9: Sitewide checks
Search all visible copy in src/ for each of the following and report every hit:
— and – (em and en dashes)
& (ampersand)
represent (any form)
Lafayette
curated
$ (the budget dropdown on the contact form is expected and stays; anything else is a problem)
Greater Cincinnati
Amy K. Clark Design
every word on the banned list in CLAUDE.md
Also: npm run build passes, and crawl dist/ for broken internal links.
Final interaction regression pass, in Chromium and WebKit, after all tasks: hover swap on Home (Task 2), auto-advance on Home (Task 4), scroll swap on Services (Task 5), hamburger menu open and close on every page at 390px, each tested on direct load and after view-transition navigation.
Verify: zero unexpected hits, clean build, zero broken links, regression pass clean.
Commit (only if fixes were needed): Sitewide copy rule, link, and interaction checks
Task 10: Draft deploy and report
Push branch copy-pass-v1.
npm run build && netlify deploy --dir=dist (draft deploy, NOT --prod). Report the draft URL. If draft URLs are password protected, say so.
Final report, printed in chat, in this order:
Draft URL
Deploy situation from Task 0
Mac facts from Task 2 (Reduce Motion setting, browser versions), if collected
Hover swap: root cause in one or two sentences, plus the before and after matrix
Auto-advance: the add and removal commit hashes, why it was removed, and how the restored version avoids that problem
What changed, page by page (one line each)
Exact steps for adding Reaghan later: the photo path and filename, and the constant to set for her title
Every piece of Claude-written prose added this session
Any rule violations found in the Appendix copy and left unfixed
Screenshot file paths
Anything blocked or uncertain
Appendix: Final copy (use verbatim)
HOME: tagline under hero
Boutique custom window treatment and upholstery studio serving Cincinnati and Northern Kentucky.
SERVICES
Services
Beautifully considered. Personally created. Made to work in your home.
The right window treatment does more than cover a window. It manages light and privacy, complements the architecture, brings balance to the room, and changes how the entire space feels.
Amy K Clark Design combines an experienced design eye with deep knowledge of textiles, fabrication, and installation. From the first conversation to the final detail, Amy considers how each choice will look, function, and live in your home.
Serving clients throughout Cincinnati and Northern Kentucky.
Custom Drapery
Designed for your windows and everything around them.
Custom drapery begins with the room itself: its proportions, natural light, architecture, furnishings, and the way you want the space to feel.
Amy works with you to select the right fabric, construction, lining, hardware, scale, and placement. Because she understands both design and fabrication, every recommendation is grounded in what will hang beautifully, function properly, and bring the entire room together.
From design and fabric selection through fabrication and installation, each detail is thoughtfully considered and beautifully executed.
Blinds, Shades, and Shutters
Privacy, light control, and style: all working together.
The most practical window treatments should still feel like a natural part of a well-designed room.
Amy offers custom blinds, shades, shutters, and woven woods through a trusted American manufacturer, with options across a range of styles and price points. She helps you determine what each window needs, considering privacy, sunlight, heat, ease of use, architecture, and finish.
The result is a solution that works beautifully on its own or layers seamlessly with custom drapery.
Upholstery
A new life for the pieces worth keeping.
A well-made chair, bench, or ottoman can become one of the most distinctive pieces in a room with the right fabric and thoughtful guidance.
Amy helps you evaluate whether a piece is worth reimagining, then selects materials that respect its shape, suit the way it will be used, and connect it to the rest of your home. She will also tell you honestly when a piece is not a worthwhile investment.
Because beautiful design is not about changing everything. It is about knowing what deserves to stay.
Soft Furnishings
The finishing details that make a room feel complete.
Custom pillows, cushions, and other soft furnishings introduce color, pattern, texture, and personality without requiring an entire room to be redesigned.
Amy creates these final layers with the same attention to scale, construction, comfort, and craftsmanship she brings to every project. Sometimes, the smallest addition is what makes the whole room finally feel right.
The Amy K Clark Design Difference
Amy is more than a fabric source or curtain maker. She brings together the creative vision to see what a room could become and the technical knowledge to make that vision work.
She considers the entire space and the practical problems you need to solve. She understands how a treatment should be constructed, where it should hang, and how each decision will affect the finished result.
Most importantly, the process is personal and collaborative. Amy listens closely, learns how you live, and helps you create something that feels distinctly like you.
Because the details make all the difference.
ABOUT
Meet Amy
A designer's eye. A maker's understanding.
Amy K. Clark specializes in the details that give a room its warmth, personality, and sense of completion: custom window treatments, upholstery, fabric, pillows, cushions, and trim.
Her work often begins in a room a client already loves but cannot quite finish. Amy sees what is missing, identifies the problem that has been difficult to put into words, and introduces possibilities her clients may never have considered.
It is a focused kind of design expertise, one built around the elements that must be thoughtfully imagined, carefully constructed, and made specifically for the home.
Curiosity Became Craft
Amy's fascination with beautiful things began in her grandmother's attic, exploring old trunks and taking pieces apart to understand how they had been made.
Long before it became her profession, Amy wanted to know why something hung the way it did, how its construction affected its beauty, and what thoughtful craftsmanship could make possible.
That same curiosity still guides her work today.
Designed for the Room It Belongs In
No two rooms or even two windows are truly standard. Architecture shifts. Ceilings settle. Light changes throughout the day. A beautiful fabric may behave very differently once it is pleated, lined, hung, and used every evening.
Amy personally studies and measures each space, then designs every treatment for the room in which it will live. Her knowledge of fabrication and installation shapes the design from the beginning, ensuring the finished piece is not only beautiful, but beautifully resolved.
Materials Chosen With Experience
Amy sources fabrics from respected design houses, including Schumacher. She keeps her library intentional because knowing how a material performs is more valuable than simply offering endless options.
Color and pattern may capture your attention first. Amy also considers how the fabric will hang, feel, wear, and live in your home for years to come.
That is the difference between choosing something beautiful and creating something that truly belongs.
The details make all the difference.
(Then the Studio section, per Task 6.)
PROCESS
(Eyebrow label stays: Process)
What It's Like to Work Together
Begin with a conversation
Schedule a complimentary 15-minute call to tell Amy about your home, your windows, and what you would like to change.
Explore the possibilities
In a paid in-home design consultation, Amy visits your home to understand the room, take measurements, identify practical needs, and begin exploring fabrics, materials, and solutions with you.
Refine the details
Together, you will select the design, materials, construction, and finishing details that make the project feel personal and complete.
Bring it to life
Amy oversees the project through fabrication and installation, ensuring the finished result looks beautiful, functions properly, and feels at home in the room.
Let's Make Your Home Feel More Like You
Whether you know exactly what you love or simply know that the room does not feel finished, Amy can help you see what is possible.
[Button: Schedule your complimentary discovery call → /contact]
(Note for the report: "In a paid in-home design consultation," at the start of step 02 is a Claude-written addition. Mark it.)
CONTACT: intro (above the form)
(Eyebrow label stays: Contact)
Let's Talk About Your Home
Every project begins with a complimentary 15-minute discovery call. Tell Amy what is not working, what you hope to create, and any ideas you are already considering. She will help determine whether the project is a good fit and recommend the best next step.
If you decide to move forward, the next step is a paid in-home design consultation.
Amy serves clients throughout Cincinnati and Northern Kentucky. Share a few details below, and she will be in touch to schedule your call.
(Form unchanged.)
CONTACT: Common Questions (replaces the existing section)
Common Questions
Every project begins with a conversation. You do not need to know the right terminology (or even exactly what your room needs) before reaching out. Amy will help you understand the possibilities and work through the details, and you can decide whether working together is the right fit.
What happens on the discovery call?
The complimentary discovery call is a brief conversation about your home, what is not working, what you have already considered, and what you hope to accomplish.
Amy will ask a few questions, explain how she may be able to help, and give you an honest sense of whether the project is a good fit for her expertise. If it is, she will recommend the best next step. If it is not, she will tell you that, too.
There is no preparation required and no pressure to move forward.
What happens during the in-home consultation?
This is where the design work begins. During the in-home consultation, Amy will spend approximately three hours with you in the room, studying its light, architecture, proportions, furnishings, and existing details. She will take measurements, listen to how you use the space, and help identify both the practical needs and the creative possibilities.
Depending on the project, she may bring fabrics, finishes, or product samples to consider within the actual room, where color, pattern, texture, and scale can be seen in the right context.
By the end of the consultation, you will have a clearer understanding of what the room needs and how Amy recommends approaching it. Because this is a working design session rather than a sales appointment, the in-home consultation is a paid service.
Do I need to know what I want before I call?
Not at all.
Many clients begin with the feeling that something in the room is not quite right, even if they cannot explain why. Discovering what is missing, and what will make the room feel complete, is part of Amy's work.
You may already have a strong point of view and need help refining it, or you may want Amy to show you possibilities you have not considered. Both are welcome. Photographs of the room are the most helpful thing you can share before your first conversation.
Does Amy work with interior designers, builders, and other professionals?
Yes. Amy works directly with homeowners as well as with a select group of interior designers, builders, architects, and project managers who bring her in for her textile, fabrication, and window-treatment expertise.
In these collaborations, Amy takes responsibility for the details within her specialty: custom drapery, blinds and shades, upholstery, and soft furnishings. She understands how to translate a larger design vision into treatments that are beautifully constructed, properly scaled, and thoughtfully integrated into the room.
Amy K Clark Design is not a full-service interior design firm. It offers focused expertise for the parts of a home where textiles, craftsmanship, and technical knowledge make all the difference.
Who designs, makes, and installs the work?
Amy remains personally involved from the first design decision through the final installation.
She designs and fabricates custom drapery and soft furnishings in her own workroom, with each treatment created specifically for the room in which it will live. Blinds, shades, shutters, and woven woods are custom-produced through her trusted manufacturing partner.
Because Amy understands how a treatment will be constructed and installed, those technical considerations are part of the design from the beginning, not problems left for someone else to solve later. She personally oversees the finished work and installation so the original vision carries through to the last detail.
How long does a project take?
The timeline depends on the scope of the project, the materials selected, and current fabric and product availability.
Custom fabrics may need to be ordered from a mill, and some patterns or finishes can have longer lead times. Blinds, shades, hardware, and other made-to-order elements will also have their own production schedules.
Before confirming a timeline, Amy checks availability and considers each stage of the project. She would rather give you an informed, realistic schedule than promise an optimistic date that cannot be kept.
Where does Amy work?
Amy serves clients throughout Cincinnati and Northern Kentucky. She also accepts a limited number of travel projects each year when the scope and location are the right fit. If you are outside the immediate area, begin with a discovery call to talk through your project.
Can Amy coordinate with something I already have?
Very often, yes.
A room does not need to begin from scratch. Amy can work around an existing fabric, coordinate with a treatment already in the home, refresh a piece of furniture worth keeping, or find a thoughtful way to connect something you love with the rest of the space.
Her knowledge of pattern, scale, color, construction, and placement allows her to make new elements feel intentional alongside what is already there. Bring the item (or clear photographs of it) to your consultation so Amy can evaluate it in context.
Still Wondering If Your Project Is a Fit?
You do not need to have every detail figured out. That is what the first conversation is for.
[Button: Schedule your complimentary discovery call → scrolls to the form on this page]