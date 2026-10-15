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
    minHeight: "44px",
    height: "44px",
    borderRadius: 0,
    border: state.isFocused
      ? "1px solid #9b8150"
      : "1px solid #d4cfc5",
    backgroundColor: "#faf9f6",
    boxShadow: "none",
    cursor: "pointer",
    paddingLeft: "8px",
    transition: "border-color 300ms ease",

    "&:hover": {
      borderColor: "#9b8150",
    },
  }),

  valueContainer: (base: any) => ({
    ...base,
    padding: "0 12px",
  }),

  placeholder: (base: any) => ({
    ...base,
    color: "#aaa49b",
    fontSize: "9px",
    textTransform: "uppercase",
    letterSpacing: "0.25em",
  }),

  singleValue: (base: any) => ({
    ...base,
    color: "#34312c",
    fontSize: "10px",
    letterSpacing: "0.08em",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    color: "#9b8150",
    paddingRight: "16px",
    transition: "transform 300ms ease",

    transform: state.selectProps.menuIsOpen
      ? "rotate(180deg)"
      : "rotate(0deg)",

    "&:hover": {
      color: "#9b8150",
    },
  }),

  menu: (base: any) => ({
    ...base,
    marginTop: "4px",
    borderRadius: 0,
    border: "1px solid #d4cfc5",
    backgroundColor: "#faf9f6",
    boxShadow: "0 15px 35px rgba(28, 27, 24, 0.08)",
    overflow: "hidden",
    zIndex: 50,
  }),

  menuList: (base: any) => ({
    ...base,

    /*
     * Four options visible.
     * Additional options scroll vertically.
     */
    maxHeight: "135px",
    overflowY: "auto",
    padding: "6px 0",

    /* Firefox */
    scrollbarWidth: "thin",
    scrollbarColor: "#c8b78e transparent",

    /* Chrome / Edge / Safari */
    "&::-webkit-scrollbar": {
      width: "4px",
    },

    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c8b78e",
    },

    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#9b8150",
    },
  }),

  option: (base: any, state: any) => ({
    ...base,

    minHeight: "41px",
    padding: "14px 18px",

    backgroundColor: state.isSelected
      ? "#f1eee7"
      : state.isFocused
        ? "#f5f2eb"
        : "#faf9f6",

    color: state.isSelected
      ? "#9b8150"
      : "#34312c",

    fontSize: "9px",
    lineHeight: "13px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",

    cursor: "pointer",
    transition: "all 200ms ease",

    "&:active": {
      backgroundColor: "#eee9df",
    },
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
    <div className="overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]">
      {/* HEADER */}
      <div className="border-b border-[#e2ded4] px-5 py-4 md:px-6">
        <p className="text-[8px] uppercase tracking-[0.26em] text-[#aaa69e]">
          Admin / User Management
        </p>

        <h2 className="mt-1 font-serif text-lg font-normal tracking-[0.01em] text-[#1b1a18]">
          Admin Actions
        </h2>

        <p className="mt-1.5 max-w-xl text-[9px] leading-5 text-[#817d75]">
          Manage account permissions and review customer deletion requests.
        </p>
      </div>

      <div className="space-y-6 px-5 py-5 md:px-6">
        {/* USER ROLE */}
        <div>
          <label className="mb-2 block text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
            User Role
          </label>

          {!editRole ? (
            <button
              type="button"
              onClick={() => setEditRole(true)}
              className="flex w-full items-center justify-between gap-3 border border-[#dedbd4] bg-[#fdfcf9] px-4 py-3.5 text-left transition-all duration-300 hover:border-[#9a8a74]"
            >
              <span className="text-[9px] uppercase tracking-[0.16em] text-[#34312c]">
                {currentRole}
              </span>

              <span className="shrink-0 text-[8px] uppercase tracking-[0.2em] text-[#9a8a74]">
                Edit
              </span>
            </button>
          ) : (
            <div>
              <Select
                autoFocus
                instanceId="user-role"
                styles={selectStyles}
                options={roleOptions}
                isSearchable={false}
                value={
                  roleOptions.find(
                    (option) => option.value === currentRole
                  ) ?? null
                }
                onChange={(option) =>
                  setCurrentRole(
                    option?.value as "USER" | "ADMIN"
                  )
                }
              />

              <p className="mt-2 text-[8px] leading-4 text-[#aaa69e]">
                Choose the appropriate permission level for this account.
              </p>
            </div>
          )}
        </div>

        {/* SAVE / CANCEL CHANGES */}
        {hasChanges && (
          <div className="flex gap-2.5 border-t border-[#e2ded4] pt-5">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 border border-[#1b1a18] bg-[#1b1a18] py-3 text-[8px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-[#6f604e] hover:bg-[#6f604e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentRole(savedRole);
                setEditRole(false);
              }}
              disabled={loading}
              className="flex-1 border border-[#d9d5cd] bg-[#fdfcf9] py-3 text-[8px] uppercase tracking-[0.2em] text-[#57534c] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#6f604e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Discard Changes
            </button>
          </div>
        )}

        {/* ACCOUNT DELETION */}
        <div className="border-t border-[#e2ded4] pt-6">
          <div className="mb-4">
            <p className="text-[8px] uppercase tracking-[0.24em] text-[#aaa69e]">
              Account Management
            </p>

            <h3 className="mt-1 font-serif text-base font-normal text-[#1b1a18]">
              Account Deletion
            </h3>

            <p className="mt-1 text-[9px] leading-5 text-[#817d75]">
              Review and manage the customer&apos;s account deletion request.
            </p>
          </div>

          {deletionStatus === "REQUESTED" ? (
            /* PENDING DELETION REQUEST */
            <div className="overflow-hidden border border-[#d9c9a9] bg-[#f8f4eb]">
              {/* REQUEST HEADER */}
              <div className="border-b border-[#e7dcc6] px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.24em] text-[#9a8060]">
                      Customer Request
                    </p>

                    <h4 className="mt-2 font-serif text-base font-normal text-[#1b1a18]">
                      Deletion Review
                    </h4>

                    <p className="mt-1.5 text-[9px] text-[#817d75]">
                      Waiting for admin review
                    </p>

                    {accountDeletionRequestedAt && (
                      <p className="mt-2 text-[9px] leading-5 text-[#aaa69e]">
                        Requested{" "}
                        {new Date(
                          accountDeletionRequestedAt
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 border border-[#d9c9a9] bg-[#fdfcf9] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.16em] text-[#9a8060]">
                    Pending
                  </span>
                </div>
              </div>

              {/* REQUEST DETAILS */}
              <div className="px-5 py-5">
                {accountDeletionReason && (
                  <div className="border border-[#e7dcc6] bg-[#fdfcf9] px-4 py-4">
                    <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                      Customer Reason
                    </p>

                    <p className="mt-3 whitespace-pre-line wrap-break-word text-[10px] leading-5 text-[#57534c]">
                      {accountDeletionReason}
                    </p>
                  </div>
                )}

                <p className="mt-4 text-[9px] leading-5 text-[#817d75]">
                  Review the request carefully before making a decision.
                  Approving may permanently delete this customer&apos;s account.
                </p>

                {/* REQUEST ACTIONS */}
                <div className="mt-5 grid grid-cols-2 border border-[#e7dcc6]">
                  <button
                    type="button"
                    onClick={() => handleDeletionAction("REJECT")}
                    disabled={deletionLoading}
                    className="border-r border-[#e7dcc6] bg-[#fdfcf9] px-3 py-4 text-[8px] uppercase tracking-[0.14em] text-[#57534c] transition-all duration-300 hover:bg-white hover:text-[#1b1a18] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletionLoading
                      ? "Processing..."
                      : "Reject Request"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletionAction("APPROVE")}
                    disabled={deletionLoading}
                    className="bg-[#8a6258] px-3 py-4 text-[8px] uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#745249] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletionLoading
                      ? "Processing..."
                      : "Approve Deletion"}
                  </button>
                </div>
              </div>
            </div>
          ) : deletionStatus === "REJECTED" ? (
            /* REJECTED DELETION REQUEST */
            <div className="border border-[#e2ded4] bg-[#faf9f6] px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                    Account Deletion
                  </p>

                  <h4 className="mt-2 font-serif text-base font-normal text-[#1b1a18]">
                    Request Rejected
                  </h4>
                </div>

                <span className="shrink-0 border border-[#d9d5cd] bg-[#fdfcf9] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.16em] text-[#817d75]">
                  Rejected
                </span>
              </div>

              <p className="mt-3 text-[9px] leading-5 text-[#817d75]">
                This customer&apos;s account deletion request has been
                rejected by an admin.
              </p>
            </div>
          ) : (
            /* NO DELETION REQUEST */
            <div className="border border-[#e2ded4] bg-[#faf9f6] px-5 py-5">
              <p className="text-[8px] uppercase tracking-[0.22em] text-[#aaa69e]">
                Account Status
              </p>

              <h4 className="mt-2 font-serif text-base font-normal text-[#1b1a18]">
                No Deletion Request
              </h4>

              <p className="mt-3 text-[9px] leading-5 text-[#817d75]">
                This customer has not requested account deletion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}