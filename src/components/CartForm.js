"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Bike, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { FormSchema } from "@/lib/formSchema";

export default function CartForm() {
  const customer = useCheckoutStore((state) => state.customer);
  const setCustomer = useCheckoutStore((state) => state.setCustomer);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: customer,
  });

  const fulfillmentType = watch("fulfillmentType");

  useEffect(() => {
    const subscription = watch((value) => {
      setCustomer(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, setCustomer]);

  return (
   <Card className="bg-[var(--color-background)] border border-[var(--color-card-border)] shadow-md">
      <CardHeader>
        <CardTitle className="text-[var(--color-text)]">Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input placeholder="First Name" {...register("firstName")}
            className="bg-white border border-[var(--color-card-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]" />
            <div className="h-5">
              {errors.firstName && (
                <p className="text-sm text-[var(--color-accent)]">{errors.firstName.message}</p>
              )}
            </div>
          </div>
          <div>
            <Input placeholder="Last Name" {...register("lastName")} 
            className="bg-white border border-[var(--color-card-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"/>
            <div className="h-5">
              {errors.lastName && (
                <p className="text-sm text-[var(--color-accent)]">{errors.lastName.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <Input placeholder="Email Address" {...register("email")}
          className="bg-white border border-[var(--color-card-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]" />
          <div className="h-5">
            {errors.email && (
              <p className="text-sm text-[var(--color-accent)]">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <Input placeholder="Phone Number" {...register("phoneNumber")}
          className="bg-white border border-[var(--color-card-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]" />
          <div className="h-5">
            {errors.phoneNumber && (
              <p className="text-sm text-[var(--color-accent)]">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>

        <CardTitle className="mt-8 text-[var(--color-text)]">Delivery Details</CardTitle>

        <div className="flex gap-2 mt-2">
          <Button
            className={clsx(
       +   "flex items-center gap-2 px-4 py-2 rounded text-sm font-medium border border-[var(--color-primary)] transition-colors",
   fulfillmentType === "DELIVERY"
     ? "bg-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-secondary)]"
     : "bg-[var(--color-card-bg)] text-[var(--color-primary)] hover:bg-[var(--color-card-border)]"
  )}
            type="button"
            onClick={() => setValue("fulfillmentType", "DELIVERY")}
          >
            <Bike className="w-4 h-4" />
            Delivery
          </Button>
          <Button
            className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded text-sm font-medium border border-[var(--color-primary)] transition-colors",
   fulfillmentType === "PICKUP"
    ? "bg-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-secondary)]"
     : "bg-[var(--color-card-bg)] text-[var(--color-primary)] hover:bg-[var(--color-card-border)]"
  )}
            type="button"
            onClick={() => setValue("fulfillmentType", "PICKUP")}
          >
            <Store className="w-4 h-4" />
            Pickup
          </Button>
        </div>

        <div className="text-sm text-[var(--color-muted)] flex items-center gap-2 mt-2">
          {fulfillmentType === "DELIVERY" ? (
            <>
              <Bike className="w-4 h-4 text-[var(--color-muted)]" />
              Estimated delivery: <span className="font-medium text-[var(--color-accent)]">30-40 min</span>
            </>
          ) : (
            <>
              <Store className="w-4 h-4 text-[var(--color-muted)]" />
              Estimated pickup: <span className="font-medium text-[var(--color-accent)]">15 min</span>
            </>
          )}
        </div>

        <div
          className={clsx(
            "grid grid-cols-1 gap-4 transition-all duration-300",
            fulfillmentType === "DELIVERY"
              ? "opacity-100 max-h-[1000px]"
              : "opacity-0 max-h-0 overflow-hidden"
          )}
        >
          <div>
            <Input placeholder="Street Address" {...register("deliveryAddress")}
             className="bg-white border border-[var(--color-card-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"
             />
            <div className="h-5">
              {errors.deliveryAddress && (
                <p className="text-sm text-[var(--color-accent)]">{errors.deliveryAddress.message}</p>
              )}
            </div>
          </div>

          <div>
            <Input
              placeholder="Apartment or building name (optional)"
              {...register("apartment")}
               className="bg-white border border-[var(--color-card-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
            <div className="h-5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input placeholder="Postcode" {...register("postcode")} 
               className="bg-white border border-[var(--color-card-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"/>
              <div className="h-5">
                {errors.postcode && (
                  <p className="text-sm text-[var(--color-accent)]">{errors.postcode.message}</p>
                )}
              </div>
            </div>
            <div>
              <Input placeholder="City" {...register("city")}
              className="bg-white border border-[var(--color-card-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]" />
              <div className="h-5">
                {errors.city && (
                  <p className="text-sm text-[var(--color-accent)]">{errors.city.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Input placeholder="Additional notes (optional)" {...register("notes")} 
           className="bg-white border border-[var(--color-card-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"/>
          <div className="h-5" />
        </div>
      </CardContent>
    </Card>
  );
}
