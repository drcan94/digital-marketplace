"use client";

import { useIsOpen } from "@/hooks/use-isopen";
import { useEffect, useState, PropsWithChildren } from "react";

const NavbarContainer = ({ children }: PropsWithChildren) => {
  const [scrollDirection, setScrollDirection] = useState("down");
  const { isOpen } = useIsOpen();

  const directionClassName =
    !isOpen &&
    `transition-transform duration-300 linear transform ${
      scrollDirection === "up" ? "-translate-y-full" : "translate-y-0"
    }`;

  useEffect(() => {
    let prevScrollpos = window.scrollY;
    window.onscroll = function () {
      const currentScrollPos = window.scrollY;
      if (prevScrollpos > currentScrollPos) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      prevScrollpos = currentScrollPos;
    };
  }, [scrollDirection]);
  return (
    <div
      className={`bg-white sticky z-50 top-0 inset-x-0 h-16 ${directionClassName}`}
    >
      {children}
    </div>
  );
};

export default NavbarContainer;
