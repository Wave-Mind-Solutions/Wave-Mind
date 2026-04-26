import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent"
      >
        
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-8 rounded-3xl border border-slate-100 dark:border-white/5 bg-white/70 dark:bg-[#0f121d]/70 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] max-w-[320px] w-full transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.25)] hover:-translate-y-1" 
                  key={i}
                >
                  <p className="text-slate-700 dark:text-gray-300 text-[15px] leading-relaxed font-medium">"{text}"</p>
                  <div className="flex items-center gap-4 mt-8">
                    <img
                      width={48}
                      height={48}
                      src={image}
                      alt={name}
                      className="h-12 w-12 rounded-full border-[3px] border-white dark:border-white/10 shadow-sm object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-0.5">{name}</div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-gray-400 tracking-wide uppercase">{role}</div>
                      
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
        
      </motion.div>
    </div>
  );
};
