import LoginForm from "../../components/forms/LoginForm";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const nextRoute = typeof params?.next === "string" ? params.next : "";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-10 md:flex-row md:items-stretch">
        <section className="hidden rounded-2xl bg-sky-700 p-10 text-white shadow-sm md:block md:w-1/2">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-100">Assignment Build</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight">
            Manage educational content from upload to live broadcast.
          </h2>
          <ul className="mt-6 space-y-2 text-sm text-sky-100">
            <li>Role-based teacher/principal workflows</li>
            <li>Content upload with scheduling and validation</li>
            <li>Approval queue and public live page</li>
          </ul>
        </section>

        <section className="w-full md:w-1/2">
          <LoginForm nextRoute={nextRoute} />
        </section>
      </div>
    </main>
  );
}
