import FacebookIcon from "../icons/socials/FacebookIcon";
import InstagramIcon from "../icons/socials/InstagramIcon";
import TwitterIcon from "../icons/socials/TwitterIcon";

const Footer: React.FC = () => (
  <div className="bg-black h-[128px] w-full flex justify-center items-center gap-[18px]">
    <div className="text-white text-4xl">
      <a href="https://www.facebook.com">
        <FacebookIcon />
      </a>
    </div>
    <div className="text-white text-4xl">
      <a href="https://www.instagram.com">
        <InstagramIcon />
      </a>
    </div>
    <div className="text-white text-4xl">
      <a href="https://www.twitter.com">
        <TwitterIcon />
      </a>
    </div>
  </div>
);

export default Footer;
