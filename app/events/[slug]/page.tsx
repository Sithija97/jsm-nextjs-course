import Image from "next/image";
import { Calendar, Clock, MapPin, Users, Globe } from "lucide-react";
import { notFound } from "next/navigation";

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

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

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

  return (
    <section id="event">
      <div>
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div>
        <div>
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem icon={<Calendar size={17} />} label={date} />
            <EventDetailItem icon={<Clock size={17} />} label={time} />
            <EventDetailItem icon={<MapPin size={17} />} label={location} />
            <EventDetailItem icon={<Globe size={17} />} label={mode} />
            <EventDetailItem icon={<Users size={17} />} label={audience} />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>
        {/*    Right Side - Booking Form */}
        as
      </div>
    </section>
  );
};

export default EventDetailsPage;
