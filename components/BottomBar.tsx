import { bottombarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Bottombar = () => {
  const route=usePathname()

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = link.route===route
        return (
          <Link
            key={`bottombar-${link.label}`}
            href={link.route}
            className={`${
              isActive && "rounded-[10px] bg-primary-500 "
            } flex-center flex-col gap-1 p-2 transition`}>
        <div className={`${
            isActive && "rounded-[10px] bg-primary-500 "
          } flex-center flex-col gap-1 p-2 transition`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />

            <p className="tiny-medium text-light-2">{link.label}</p>
        </div>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
