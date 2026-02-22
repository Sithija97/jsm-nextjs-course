import EventCard from "@/components/common/event-card";
import { Button } from "@/components/ui/button";
import { events } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero/Banner Section */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 space-y-4">
          <h1 className="text-3xl sm:text-3xl font-semibold tracking-tight">
            The Hub for Every Dev Event You Can&apos;t Miss
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Hackathons, Meetups, and Conferences, All in One Place
          </p>
          <div className="pt-2">
            <Button
              size="default"
              variant={"secondary"}
              className="font-semibold"
            >
              Explore Events
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Featured Events
            </h2>
            <Button variant="ghost" className="hidden sm:inline-flex">
              View All
            </Button>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <li key={event.title} className="group">
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
