import { motion } from "framer-motion";

const CurtainRight = () => {
  return (
    <motion.path
      fill="url(#aa)"
      initial={{ x: "0%" }}
      animate={{ x: "30%" }}
      transition={{
        duration: 2,
        delay: 0.4,
        type: "tween",
      }}
      d="M381.93 2.55s4.31 162.37.9 229.27c-2.6 51.03 4.05 168.35 4.05 168.35s14.94 6 33.5 2.97c31.34-11.87 13.16 5.09 42.84-6.64 18.56-7.33 32.09 5.74 53.31 4.55 19.67-1.1 25.99-13.02 43.75-9.12 43.58 9.57 91.74-4.94 91.74-4.94L646.9 2.55H381.92Z"
    />
  );
};

export default CurtainRight;
