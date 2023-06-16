import { motion } from "framer-motion";

const CurtainLeft = () => {
  return (
    <motion.path
      fill="url(#ab)"
      initial={{ x: "0%" }}
      animate={{ x: "-29%" }}
      transition={{
        duration: 1.8,
        delay: 0.4,
        type: "tween",
      }}
      d="M384.78 0s-.1 153 5.47 218.7c4.23 49.85-3.07 174.81-3.07 174.81s-25.53 6.71-43.42 4.85c-30.46-9.78-32.54 5.74-61.48-3.98-18.21-6.12-25.67 2.98-46.6 3.07-19.49.09-25.9-11.32-43.56-6.41-43.64 12.14-92.76.56-92.76.56V0h285.42Z"
    />
  );
};

export default CurtainLeft;
