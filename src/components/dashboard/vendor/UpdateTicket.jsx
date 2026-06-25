"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  Button,
  Select,
  CheckboxGroup,
  Checkbox,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { card, title, buttonPrimary } from "@/styles/ui";


import toast from 'react-hot-toast';



const UpdateTicket = ({ ticketData }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: ticketData?.title || "",
      fromLocation: ticketData?.fromLocation || "",
      toLocation: ticketData?.toLocation || "",
      departureDate: ticketData?.departureDate || "",
      departureTime: ticketData?.departureTime || "",
      price: ticketData?.price || 0,
      quantity: ticketData?.quantity || 1,
      transportType: ticketData?.transportType || "t",
      image: ticketData?.image || "",
      perks: ticketData?.perks || [],
    },
  });

  const selectedPerks = watch("perks");
  const selectedTransport = watch("transportType");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      const updatedPayload = {
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity),
      };

      const res = await fetch(
        `${serverUrl}/vendor/my-added-tickets/${ticketData?._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPayload),
        }
      );

      if (res.ok) {
        alert("Ticket updated successfully!");
        router.push("/dashboard/vendor/my-added-tickets");
        router.refresh();
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to update ticket.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-6 md:p-8 border shadow-xl rounded-2xl bg-white dark:bg-neutral-900 ${card}`}
    >
      <h3 className={`text-xl font-bold mb-6 ${title}`}>
        Modify Ticket Details
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Title */}
        <Input
          {...register("title", { required: "Title is required" })}
          label="Ticket Title"
          placeholder="Dhaka To Chittagong"
          variant="bordered"
          isInvalid={!!errors.title}
          errorMessage={errors.title?.message}
        />

        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...register("fromLocation", {
              required: "From location is required",
            })}
            label="From"
            variant="bordered"
            isInvalid={!!errors.fromLocation}
            errorMessage={errors.fromLocation?.message}
          />

          <Input
            {...register("toLocation", {
              required: "To location is required",
            })}
            label="To"
            variant="bordered"
            isInvalid={!!errors.toLocation}
            errorMessage={errors.toLocation?.message}
          />
        </div>

        {/* Date / Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...register("departureDate", {
              required: "Date is required",
            })}
            type="date"
            label="Departure Date"
            variant="bordered"
          />

          <Input
            {...register("departureTime", {
              required: "Time is required",
            })}
            type="time"
            label="Departure Time"
            variant="bordered"
          />
        </div>

        {/* Price / Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...register("price", { required: true })}
            type="number"
            label="Price"
            variant="bordered"
          />

          <Input
            {...register("quantity", { required: true })}
            type="number"
            label="Quantity"
            variant="bordered"
          />
        </div>

        {/* Transport Select (v3 FIX) */}
        <Select
          label="Transport Type"
          variant="bordered"
          selectedKeys={[selectedTransport || "t"]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0];
            setValue("transportType", value);
          }}
        >
          <option value="t">Train</option>
          <option value="b">Bus</option>
          <option value="o">Others</option>
        </Select>

        {/* Image */}
        <Input
          {...register("image")}
          label="Image URL"
          variant="bordered"
        />

        {/* Perks */}
        <CheckboxGroup
          label="Perks"
          orientation="horizontal"
          value={selectedPerks}
          onValueChange={(val) => setValue("perks", val)}
        >
          <Checkbox value="AC">AC</Checkbox>
          <Checkbox value="WiFi">WiFi</Checkbox>
          <Checkbox value="Snacks">Snacks</Checkbox>
          <Checkbox value="Sleeper">Sleeper</Checkbox>
        </CheckboxGroup>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="flat"
            onClick={() =>
              router.push("/dashboard/vendor/my-added-tickets")
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className={buttonPrimary}
            isDisabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTicket;