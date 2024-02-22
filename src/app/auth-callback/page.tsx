"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";

const Callback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, error } = trpc.authCallback.useQuery(undefined, {
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
      // router.push(origin ? `/${origin}` : "/dashboard");
    } else if (error?.data?.code === "UNAUTHORIZED") {
      // console.log("error: ", error);
      router.push("/sign-in");
    }
    return () => {};
  }, [data, error, router, origin]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2Icon className="h-8 w-8 animate-spin text-foreground" />
        <h3
          className="
          font-semibold text-xl
      "
        >
          Setting Up your account...
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Callback;
