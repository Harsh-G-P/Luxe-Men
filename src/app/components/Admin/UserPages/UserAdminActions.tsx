"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from "react-select";
import { toast } from "sonner";

const roleOptions = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
];

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "46px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#000" : "#e5e7eb",
    boxShadow: "none",

    "&:hover": {
      borderColor: "#000",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),
};

type Props = {
  userId: string;
  role: "USER" | "ADMIN";
  accountDeletionStatus: "NONE" | "REQUESTED" | "REJECTED";
  accountDeletionReason: string | null;
  accountDeletionRequestedAt: string | null;
};

export default function UserAdminActions({
  userId,
  role,
  accountDeletionStatus,
  accountDeletionReason,
  accountDeletionRequestedAt,
}: Props) {
  const [currentRole, setCurrentRole] = useState(role);
  const [savedRole, setSavedRole] = useState(role);
  const [editRole, setEditRole] = useState(false);
  const [loading, setLoading] = useState(false)
  const [deletionStatus, setDeletionStatus] = useState(
    accountDeletionStatus
  );
  const [deletionLoading, setDeletionLoading] = useState(false);

  const router = useRouter()

  const hasChanges = currentRole !== savedRole;

  const handleUpdate = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: currentRole,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Failed to update user")
        setCurrentRole(role)
        setEditRole(false)
        return
      }

      const updatedRole = data.data.role

      toast.success("User role updated"),
        setCurrentRole(updatedRole)
      setSavedRole(updatedRole)
      setEditRole(false)

      router.refresh()

    } catch (error) {
      toast.error("Failed to update user role")
      setCurrentRole(savedRole)
      setEditRole(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletionAction = async (
    action: "APPROVE" | "REJECT"
  ) => {
    try {
      setDeletionLoading(true);

      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.message || "Failed to process deletion request"
        );
        return;
      }

      if (action === "REJECT") {
        setDeletionStatus("REJECTED");
        toast.success("Account deletion request rejected");
        router.refresh();
        return;
      }

      toast.success("User account deleted");
      router.push("/admin/user");

    } catch {
      toast.error("Failed to process deletion request");
    } finally {
      setDeletionLoading(false);
    }
  };

  return (
    <div className="border border-neutral-200 bg-white">

      <div className="border-b border-neutral-200 px-6 py-5">
        <h2 className="text-sm uppercase tracking-[0.18em]">
          Admin Actions
        </h2>
      </div>

      <div className="space-y-6 px-6 py-6">

        {/* User Role */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-neutral-500">
            User Role
          </label>

          {!editRole ? (
            <button
              type="button"
              onClick={() => setEditRole(true)}
              className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left transition hover:border-black"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-800">
                {currentRole}
              </span>

              <span className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                Edit
              </span>
            </button>
          ) : (
            <Select
              autoFocus
              instanceId="user-role"
              styles={selectStyles}
              options={roleOptions}
              value={roleOptions.find(
                (option) => option.value === currentRole
              )}
              onChange={(option) =>
                setCurrentRole(
                  option?.value as "USER" | "ADMIN"
                )
              }
            />
          )}
        </div>

        {/* Save / Cancel */}
        {hasChanges && (
          <div className="flex gap-3">

            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 border border-black py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-black hover:text-white"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentRole(savedRole);
                setEditRole(false);
              }}
              className="flex-1 border border-neutral-300 py-3 text-xs uppercase tracking-[0.12em] transition hover:bg-neutral-100"
            >
              Cancel
            </button>

          </div>
        )}

        {/* Account Deletion */}
        <div className="border-t border-neutral-200 pt-7">
          <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
            Account Deletion
          </label>

          {deletionStatus === "REQUESTED" ? (
            <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-[#fffdf7] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

              {/* Pending Header */}
              <div className="flex items-start justify-between border-b border-amber-100 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.10)]" />

                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                      Deletion Request
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-medium text-neutral-800">
                    Waiting for admin review
                  </p>

                  {accountDeletionRequestedAt && (
                    <p className="mt-1 text-[11px] text-neutral-400">
                      Requested{" "}
                      {new Date(
                        accountDeletionRequestedAt
                      ).toLocaleString()}
                    </p>
                  )}
                </div>

                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                  Pending
                </span>
              </div>

              {/* Request Details */}
              <div className="px-5 py-5">

                {accountDeletionReason && (
                  <div className="rounded-xl border border-neutral-200/80 bg-white px-4 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      Customer Reason
                    </p>

                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      {accountDeletionReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => handleDeletionAction("REJECT")}
                    disabled={deletionLoading}
                    className="rounded-xl border border-neutral-200 bg-white py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletionLoading ? "Processing..." : "Reject Request"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletionAction("APPROVE")}
                    disabled={deletionLoading}
                    className="rounded-xl bg-neutral-900 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletionLoading ? "Processing..." : "Approve Deletion"}
                  </button>

                </div>
              </div>
            </div>

          ) : deletionStatus === "REJECTED" ? (

            /* Rejected */
            <div className="rounded-2xl border border-neutral-200 bg-[#fafafa] px-5 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.025)]">

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <span className="h-2 w-2 rounded-full bg-neutral-400" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
                    Request Rejected
                  </p>

                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    This customer's account deletion request has been rejected by an admin.
                  </p>
                </div>
              </div>

            </div>

          ) : (

            /* No Request */
            <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.025)]">

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-50">
                  <span className="h-2 w-2 rounded-full bg-neutral-300" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    No Deletion Request
                  </p>

                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    This customer has not requested account deletion.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>


      </div>
    </div>
  );
}