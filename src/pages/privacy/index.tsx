import { type NextPage } from "next";
import Head from "next/head";

const Privacy: NextPage = () => {
    return (
        <>
            <Head>
                <title>Camplipong</title>
                <meta name="description" content="Camplify Ping Pong Leaderboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="md:w-max-screen-lg bg-mauve-300 flex flex-col items-center md:mx-auto md:my-0">
                <section>
                    <h2 className="m-4 flex justify-center text-2xl font-bold">Privacy Policy</h2>
                    <p>
                        Camplipong is committed to providing quality services to you and this policy outlines our
                        ongoing obligations to you in respect of how we manage your Personal Information. We have
                        adopted the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) (the
                        Privacy Act). The NPPs govern the way in which we collect, use, disclose, store, secure and
                        dispose of your Personal Information. A copy of the Australian Privacy Principles may be
                        obtained from the website of The Office of the Australian Information Commissioner at
                        https://www.oaic.gov.au/.
                    </p>
                    <h3 className="mt-4  text-lg font-bold">What is Personal Information and why do we collect it?</h3>
                    <p>
                        Personal Information is information or an opinion that identifies an individual. Examples of
                        Personal Information we collect includes names, addresses, email addresses, phone and facsimile
                        numbers. We don’t guarantee website links or policy of authorised third parties. We collect your
                        Personal Information for the primary purpose of providing our services to you, providing
                        information to our clients and marketing. We may also use your Personal Information for
                        secondary purposes closely related to the primary purpose, in circumstances where you would
                        reasonably expect such use or disclosure. You may unsubscribe from our mailing/marketing lists
                        at any time by contacting us in writing. When we collect Personal Information we will, where
                        appropriate and where possible, explain to you why we are collecting the information and how we
                        plan to use it.
                    </p>
                    <h3 className="mt-4  text-lg font-bold">Third Parties</h3>
                    <p>
                        Where reasonable and practicable to do so, we will collect your Personal Information only from
                        you. However, in some circumstances we may be provided with information by third parties. In
                        such a case we will take reasonable steps to ensure that you are made aware of the information
                        provided to us by the third party.
                    </p>
                    <h3 className="mt-4  text-lg font-bold">Disclosure of Personal Information</h3>
                    <p>Your Personal Information will not be disclosed to third parties.</p>
                    <h3 className="mt-4  text-lg font-bold">Security of Personal Information</h3>
                    <p>
                        Your Personal Information is stored in a manner that reasonably protects it from misuse and loss
                        and from unauthorized access, modification or disclosure. When your Personal Information is no
                        longer needed for the purpose for which it was obtained, we will take reasonable steps to
                        destroy or permanently de-identify your Personal Information. However, most of the Personal
                        Information is or will be stored in client files which will be kept by us for a minimum of 7
                        years.
                    </p>
                    <h3 className="mt-4  text-lg font-bold">Access to your Personal Information</h3>
                    <p>
                        You may access the Personal Information we hold about you and to update and/or correct it,
                        subject to certain exceptions. If you wish to access your Personal Information, please contact
                        us in writing. Camplipong will not charge any fee for your access request, but may charge an
                        administrative fee for providing a copy of your Personal Information. In order to protect your
                        Personal Information we may require identification from you before releasing the requested
                        information.
                    </p>
                    <h3 className="mt-4  text-lg font-bold">Maintaining the Quality of your Personal Information</h3>
                    <p>
                        It is an important to us that your Personal Information is up to date. We will take reasonable
                        steps to make sure that your Personal Information is accurate, complete and up-to-date. If you
                        find that the information we have is not up to date or is inaccurate, please advise us as soon
                        as practicable so we can update our records and ensure we can continue to provide quality
                        services to you.
                    </p>
                    <h3 className="mt-4 text-lg font-bold">Policy Updates</h3>
                    <p>This Policy may change from time to time and is available on our website.</p>
                </section>
            </main>
        </>
    );
};

export default Privacy;
