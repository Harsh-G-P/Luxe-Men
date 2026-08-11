
"use client";

type Props = {
  userId: string;
};

export default function UserAdminActions({ userId }: Props) {
  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">
        <h2 className="text-sm uppercase tracking-[0.18em]">
          Admin Actions
        </h2>
      </div>

      <div className="space-y-3 px-6 py-6">

        <button
          type="button"
          className="w-full border border-black px-5 py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-black hover:text-white"
        >
          Edit User
        </button>
      </div>

    </div>
  );
}