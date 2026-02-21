import {Button} from "@/components/ui/button";

export default function Home() {
    return (
    <section>
        <h1 className="text-center">The Hub for Every Dev  Event You Can&apos;t Miss</h1>
        <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>
        <Button variant={"ghost"}>Explore</Button>

        <div className={"mt-20 space-y-7"}>
            <h3>Featured Events</h3>

            <ul>
                {[1,2,3,4,5,6].map((event) => (
                    <li key={event}>Event {event}</li>
                ))}
            </ul>
        </div>

    </section>
  );
}
