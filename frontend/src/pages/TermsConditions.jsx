import Navbar from "../components/Navbar"

function TermsConditions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <p className="text-gray-600 mb-6">
              Welcome to PopVerseNepal. These terms and conditions outline the rules and regulations for the use of our
              website.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-600">
                  By accessing this website, we assume you accept these terms and conditions in full. Do not continue to
                  use PopVerseNepal's website if you do not accept all of the terms and conditions stated on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
                <p className="text-gray-600 mb-4">
                  Other than the content you own, under these terms, PopVerseNepal and/or its licensors own all the
                  intellectual property rights and materials contained in this website.
                </p>
                <p className="text-gray-600">
                  You are granted limited license only for purposes of viewing the material contained on this website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Restrictions</h2>
                <p className="text-gray-600 mb-4">You are specifically restricted from all of the following:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Publishing any website material in any other media</li>
                  <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
                  <li>Publicly performing and/or showing any website material</li>
                  <li>Using this website in any way that is or may be damaging to this website</li>
                  <li>Using this website in any way that impacts user access to this website</li>
                  <li>
                    Using this website contrary to applicable laws and regulations, or in any way may cause harm to the
                    website, or to any person or business entity
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Content</h2>
                <p className="text-gray-600 mb-4">
                  In these terms and conditions, "Your Content" shall mean any audio, video, text, images or other
                  material you choose to display on this website. By displaying Your Content, you grant PopVerseNepal a
                  non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt,
                  publish, translate and distribute it in any and all media.
                </p>
                <p className="text-gray-600">
                  Your Content must be your own and must not be infringing on any third party's rights. PopVerseNepal
                  reserves the right to remove any of Your Content from this website at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. No Warranties</h2>
                <p className="text-gray-600">
                  This website is provided "as is," with all faults, and PopVerseNepal makes no express or implied
                  representations or warranties, of any kind related to this website or the materials contained on this
                  website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-600">
                  In no event shall PopVerseNepal, nor any of its officers, directors and employees, be held liable for
                  anything arising out of or in any way connected with your use of this website, whether such liability
                  is under contract, tort or otherwise.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Governing Law & Jurisdiction</h2>
                <p className="text-gray-600">
                  These terms will be governed by and interpreted in accordance with the laws of Nepal, and you submit
                  to the non-exclusive jurisdiction of the state and federal courts located in Nepal for the resolution
                  of any disputes.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TermsConditions
