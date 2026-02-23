import Link from "next/link";
import Image from "next/image";

interface IProps {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}
const EventCard = ({ title, image, slug, location, date, time }: IProps) => {
  return (
    <Link href={`/events/${slug}`} id={"event-card"}>
      <div className="relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" />
          ) : (
            <p className="text-muted-foreground">{title}</p>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {/* Location Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21c-4.5-4.5-7-7.5-7-10A7 7 0 0 1 19 11c0 2.5-2.5 5.5-7 10z"
                />
                <circle cx="12" cy="11" r="2" />
              </svg>
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {/* Date Icon */}
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 2v4M16 2v4M3 10h18"
                  />
                </svg>
                <span>{date}</span>
              </span>
              {/* Time Icon */}
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7v5l3 3"
                  />
                </svg>
                <span>{time}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default EventCard;
