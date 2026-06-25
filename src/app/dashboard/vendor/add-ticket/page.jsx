"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Label,
  Select,
  ListBox,
  Checkbox,
  Button,
  Textarea,
} from "@heroui/react";
import {
  HiOutlineTicket,
  HiOutlineUpload,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { BiCalendar, BiTimeFive } from "react-icons/bi";
import { FaMoneyBillWave, FaHashtag } from "react-icons/fa";
import { card, title, text, muted, buttonPrimary } from "@/styles/ui";
import { authClient } from "@/lib/auth-client";


import toast from 'react-hot-toast';



const AddTicketPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [perks, setPerks] = useState([]);
  const [transportType, setTransportType] = useState("");

  const perkOptions = ["AC", "Breakfast", "WiFi", "Charging Port", "Snacks"];
  const transportOptions = [
    { id: "bus", label: "Bus" },
    { id: "train", label: "Train" },
    { id: "flight", label: "Flight" },
    { id: "launch", label: "Launch" },
    { id: "others", label: "Others" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: "POST", body: formData }
    );
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const formData = new FormData(e.target);
      const ticketData = {
        title: formData.get("title"),
        fromLocation: formData.get("fromLocation"),
        toLocation: formData.get("toLocation"),
        transportType: transportType,
        price: parseFloat(formData.get("price")),
        quantity: parseInt(formData.get("quantity"), 10),
        departureDate: formData.get("departureDate"),
        departureTime: formData.get("departureTime"),
        perks: perks,
        image: imageUrl,
        vendorName: user?.name || "",
        vendorEmail: user?.email || "",
        verificationStatus: "pending",
      };

      console.log("ticketData", ticketData);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/vendor/add-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      if (!res.ok) throw new Error("Failed to save ticket");

      toast.success("Ticket added successfully! 🎫");
      router.push("/dashboard/vendor/my-added-tickets");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (user?.role !== "vendor") {
    return <div className="p-6 text-red-500">You are not authorized to add tickets.</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 transition-colors relative">
      <div className="absolute w-[300px] h-[300px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[80px] top-10 left-10 pointer-events-none" />

      <div className={`p-6 md:p-8 shadow-xl relative z-10 ${card}`}>
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 dark:border-neutral-800 pb-4">
          <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500">
            <HiOutlineTicket className="size-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${title}`}>
              Add New Ticket
            </h1>
            <p className={`text-xs mt-1 ${muted}`}>
              Fill in all the details below to list your ticket
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ticket Title */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="title" className={text}>
              Ticket Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Dhaka to Chittagong AC Bus"
              required
              className={text}
            />
          </div>

          {/* From & To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="fromLocation" className={text}>
                From (Location)
              </Label>
              <Input
                id="fromLocation"
                name="fromLocation"
                placeholder="Dhaka"
                required
                startcontent={<HiOutlineLocationMarker className={muted} />}
                className={text}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="toLocation" className={text}>
                To (Location)
              </Label>
              <Input
                id="toLocation"
                name="toLocation"
                placeholder="Chittagong"
                required
                startcontent={<HiOutlineLocationMarker className={muted} />}
                className={text}
              />
            </div>
          </div>

          {/* Transport Type, Price, Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <Label className={text}>Transport Type</Label>
              <Select
                name="transportType"
                placeholder="Select type"
                selectedKeys={transportType ? [transportType] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setTransportType(selected);
                }}
                className="w-full"
                classNames={{
                  trigger: text,
                  value: text,
                  label: text,
                }}
              >
                <Label className="sr-only">Transport Type</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {transportOptions.map((opt) => (
                      <ListBox.Item
                        key={opt.id}
                        id={opt.id}
                        textValue={opt.label}
                        className={text}
                      >
                        {opt.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="price" className={text}>
                Price per unit (৳)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="500"
                required
                startcontent={<FaMoneyBillWave className={muted} />}
                className={text}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="quantity" className={text}>
                Ticket Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="10"
                required
                startcontent={<FaHashtag className={muted} />}
                className={text}
              />
            </div>
          </div>

          {/* Departure Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="departureDate" className={text}>
                Departure Date
              </Label>
              <Input
                id="departureDate"
                name="departureDate"
                type="date"
                required
                startcontent={<BiCalendar className={muted} />}
                className={text}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="departureTime" className={text}>
                Departure Time
              </Label>
              <Input
                id="departureTime"
                name="departureTime"
                type="time"
                required
                startcontent={<BiTimeFive className={muted} />}
                className={text}
              />
            </div>
          </div>

          
          {/* Perks – Basic Checkbox Format */}
          <div className="space-y-2">
            <span className={`text-sm font-medium ${text}`}>
              Perks / Amenities (Must have to click on Text)
            </span>

            <div className="flex flex-wrap gap-3">
              {perkOptions.map((perk) => {
                const isChecked = perks.includes(perk);

                return (
                  <Checkbox
                    key={perk}
                    isSelected={isChecked}
                    onChange={(checked) => {
                      setPerks((prev) =>
                        checked
                          ? [...prev, perk]
                          : prev.filter((p) => p !== perk)
                      );
                    }}
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>

                    <Checkbox.Content>
                      <span className={text}>{perk}</span>
                    </Checkbox.Content>
                  </Checkbox>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className={text}>Upload Ticket Image</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <label className="sm:col-span-2 flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 dark:border-neutral-800 rounded-xl cursor-pointer bg-gray-50/50 dark:bg-neutral-900/30 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <HiOutlineUpload
                    className={`size-8 mb-2 group-hover:text-blue-500 transition-colors ${muted}`}
                  />
                  <p className={`text-sm font-semibold ${text}`}>Click to upload</p>
                  <p className={`text-xs mt-1 ${muted}`}>
                    PNG, JPG, WEBP (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <div className="h-36 border border-gray-200 dark:border-neutral-800 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-neutral-900/50 relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className={`text-xs text-center px-2 ${muted}`}>
                    No Image
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Vendor Name & Email (Readonly) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className={text}>Vendor Name</Label>
              <div
                className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30 ${text}`}
              >
                {user?.name || ""}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className={text}>Vendor Email</Label>
              <div
                className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30 ${text}`}
              >
                {user?.email || ""}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              isLoading={loading}
              className={`w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-indigo-600/10 hover:opacity-95 transition-all ${buttonPrimary}`}
            >
              Add Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicketPage;