export default function Connect() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-wheelock-dark mb-8">Connect</h1>

        <div className="grid gap-8">
          <div className="bg-wheelock-light border-l-4 border-wheelock-accent p-6 rounded shadow">
            <h2 className="text-2xl font-bold text-wheelock-dark mb-3">Contact</h2>
            <p className="text-gray-800 leading-relaxed">
              Mail us at: 4 West Wheelock Street, Hanover, NH 03755.
            </p>
            <p className="text-gray-800 leading-relaxed mt-2">
              Visit: The Wheelock House is open to the public every day, 8am – 10pm. Whenever you're in Hanover, please make yourself at home.
            </p>
            <a
              href="mailto:charlie@wheelocksociety.org"
              className="inline-block mt-3 text-wheelock-accent hover:text-wheelock-dark underline"
            >
              Email us at charlie@wheelocksociety.org
            </a>
          </div>

          <div className="bg-wheelock-light border-l-4 border-wheelock-accent p-6 rounded shadow">
            <h2 className="text-2xl font-bold text-wheelock-dark mb-3">Newsletters</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Choose the newsletter cadence that suits you best.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://lp.constantcontactpages.com/sl/K7WxNQv/quarterly"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-wheelock-accent text-white px-4 py-2 rounded hover:opacity-90"
              >
                Quarterly
              </a>
              <a
                href="https://lp.constantcontactpages.com/su/apx8wmX/monthly"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-wheelock-dark text-white px-4 py-2 rounded hover:opacity-90"
              >
                Monthly
              </a>
            </div>
          </div>

          <div className="bg-wheelock-light border-l-4 border-wheelock-accent p-6 rounded shadow">
            <h2 className="text-2xl font-bold text-wheelock-dark mb-3">Donate</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              The Wheelock Society is a 501(c)(3) nonprofit organization. All donations are tax-deductible. Donations can be made by check payable to Eleazar Wheelock Society, Inc., and mailed to 4 W Wheelock Street, Hanover, NH 03755.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.paypal.com/donate?hosted_button_id=JA9VFAW6MNY8W"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-wheelock-accent text-white px-4 py-2 rounded hover:opacity-90"
              >
                Donate via PayPal
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSexdz97qNckrgk_s3XjQyvY8FqXWurj5S9rww9asrIdwycO7Q/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-wheelock-dark text-white px-4 py-2 rounded hover:opacity-90"
              >
                Pledge
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
