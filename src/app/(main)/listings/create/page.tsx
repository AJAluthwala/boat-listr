import CreateListingForm from "@/components/listings/create-listing-form";

export default function Page() {
  return (
    <main
      className="bl-container"
      style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}
    >
      <CreateListingForm />
    </main>
  );
}
