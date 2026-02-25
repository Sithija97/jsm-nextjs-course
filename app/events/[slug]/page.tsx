import Image from "next/image";
import { Calendar, Clock, MapPin, Users, Globe } from "lucide-react";
import { notFound } from "next/navigation";
import BookEvent from "@/components/common/book-event";
import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/common/event-card";

interface IProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-2">
    {icon}
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  // If agendaItems is a single string with commas, split it
  let items: string[] = [];
  if (
    agendaItems.length === 1 &&
    typeof agendaItems[0] === "string" &&
    agendaItems[0].includes(",")
  ) {
    items = agendaItems[0].split(",").map((s) => s.trim());
  } else {
    items = agendaItems;
  }
  return (
    <div className="flex flex-col gap-3 mt-2">
      <h2 className="text-lg font-semibold mb-1">Agenda</h2>
      <ul className="flex flex-col gap-2 list-disc list-inside pl-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-foreground/90 pl-1">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const EventDetailsPage = async ({ params }: IProps) => {
  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);

  const data = await response.json();

  if (!data || !data.event) return notFound();

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = data.event;

  const bookings = 10; // Placeholder for number of bookings, replace with actual data when available

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event" className="py-12 bg-background">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="rounded-xl overflow-hidden border bg-card shadow-sm">
            {image && (
              <Image
                src={image}
                alt="Event Banner"
                width={800}
                height={400}
                className="w-full h-72 object-cover"
                priority
              />
            )}
            <div className="p-6 flex flex-col gap-6">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {description}
              </h1>
              <section className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">Overview</h2>
                <p className="text-muted-foreground">{overview}</p>
              </section>
              <section className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">Event Details</h2>
                <div className="flex flex-wrap gap-4">
                  <EventDetailItem icon={<Calendar size={20} />} label={date} />
                  <EventDetailItem icon={<Clock size={20} />} label={time} />
                  <EventDetailItem
                    icon={<MapPin size={20} />}
                    label={location}
                  />
                  <EventDetailItem icon={<Globe size={20} />} label={mode} />
                  <EventDetailItem
                    icon={<Users size={20} />}
                    label={audience}
                  />
                </div>
              </section>
              <EventAgenda agendaItems={agenda} />
              <section className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">About the Organizer</h2>
                <p className="text-muted-foreground">{organizer}</p>
              </section>
              <EventTags tags={tags} />
            </div>
          </div>
        </div>
        {/* Booking Form Side Card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm text-muted-foreground">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Be the first to book your spot!
              </p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="w-full flex flex-col gap-6 pt-20 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-2">Similar Events</h2>
        {similarEvents.length > 0 ? (
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin scrollbar-thumb-muted/40 scrollbar-track-transparent">
              {similarEvents.map((similarEvent: IEvent) => (
                <div
                  key={similarEvent.title}
                  className="min-w-[320px] max-w-xs snap-center"
                >
                  <EventCard {...similarEvent} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No similar events found.</p>
        )}
      </div>
    </section>
  );
};

export default EventDetailsPage;
