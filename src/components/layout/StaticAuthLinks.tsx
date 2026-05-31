import Link from "next/link";

type StaticAuthLinksProps = {
  mobile?: boolean;
};

export default function StaticAuthLinks({ mobile = false }: StaticAuthLinksProps) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/register"
          className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary cursor-pointer text-center"
        >
          Sign In
        </Link>
        <Link href="/register" className="btn-primary-brand w-full justify-center">
          Get Access
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/register" className="nav-link cursor-pointer">
        Sign In
      </Link>
      <Link href="/register" className="btn-primary-brand text-sm !py-2.5 !px-5">
        Get Access
      </Link>
    </>
  );
}
