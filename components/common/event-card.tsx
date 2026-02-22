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
    <Link href={"/events"} id={"event-card"}>
      <div className="relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" />
          ) : (
            <p className="text-muted-foreground">{title}</p>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg"> {title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Event description goes here
          </p>
        </div>
      </div>
    </Link>
  );
};
export default EventCard;
