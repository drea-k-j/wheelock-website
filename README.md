# Wheelock Website

## Requirements
I want a website that does not look like every other website, specifically I do not want users to have to scroll very far. I'm interested in headers or a hamburger menu, or something similar that looks fresh. The website needs to be easy for one to three non-technical administrators to update. For forms, I'm uncertain if they should be embedded or not. For the technical stack, I'm interested in something in Python and I know React. I'm familiar with FastAPI, Flask, and Django, but I'm open to other frameworks if there are any that are well suited to this request. I'm not looking for log in features (except for administrators) and I'm most unclear about how these files should be stored (the blocks of text for each section and subsection and the pictures). I need the following sections:
Main page photo reel that is easy to keep fresh. We could use a Google service for this.
Announcements: front page, multiple announcements at a time, most will link to other pages
About: Mission and Vision (this is for a non-profit), History, Programming, Leadership
Wheelock Weekend: specific annual event. Part of the year, this will have these sections: Schedule, Bios, Campus Map, and Registration (google form). Part of the year we want to show that we are thankful to attendees and part of the year we want to have a "pending" or "coming soon" page
Wheelock House: About, Calendar (Google calendar embedded), and Reservation Requests (Google form)
Residents: Could be a subsection of Wheelock House, I'm not sure. PDF Residents' Manual, Application (Google form), Key Dates (not a calendar, just a list)
Newsletters: Archive, Sign-up (Google form). These newsletters are created and sent out elsewhere, but I want to save them here in the archive.
Contact: Form? Links for LinkedIn, Instagram. Wheelock House Address.
Donate: paypal link, pledge form, instructions for sending a check (also to the Wheelock House address)

Can you help me first with the plan for the website and what tech stack I should use?

Photo reel frequency: Admins will probably upload new images once a month and retire one or two images as well. Other photos on the website will get changed a little less often, like once a year.
Newsletter archive: It would be great to auto-sync but we want to know how much that would cost and how difficult it is to set up.
Admin skill level: Working from the command line is too much but working in the UI is fine. I don't know what you mean by "simple form UI" vs "ultra-minimal interface"
Budget: How low can we go? What do we gain by spending more? What's a reasonable range for this kind of website, given it is mostly static?
I have a question: I use inmotion for hosting, can I still use it? Does that change the tech stack?
I'd like you to answer these questions before we build a prototype.

Does Constant Contact have a Newsletter Service API we could use? Can you link us the documentation to set that up?
Is it possible to switch away from inmotion to a provider that can host all of it (Modern Python/React stack, file storage, database) rather than piecing together InMotion + Railway/Render + Cloudinary?
I think we're close to a final design, please answer these questions first.

Where would I run the script to connect constant contact with the API? Is the admin dashboard for Render.com viable for our admin user profile?
Yes, go ahead and build the basic components. I'd love for you to build out a dummy that we can see locally now and it can just include the Announcements, About section, and one other section. Feel free to fill in with latin text for the examples.
