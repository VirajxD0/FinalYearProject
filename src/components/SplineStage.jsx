import React, { useEffect, useRef } from "react";
import { Application } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SplineStage() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const rotateRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const app = new Application(canvas);
    appRef.current = app;

    app
      .load("https://prod.spline.design/e6oIy9TE0-mEbI2M/scene.splinecode")
      .then(() => {
        const Damper = app.findObjectByName("Damper");
        if (!Damper) {
          console.warn(
            "keyboard object not found in Spline scene (check object name)"
          );
          return;
        }

        // initial sets
        gsap.set(Damper.scale, { x: 1, y: 1, z: 1 });
        gsap.set(Damper.position, { x: 110, y: 50 });

        const initialTransform = {
          position: {
            x: Damper.position.x,
            y: Damper.position.y,
            z: Damper.position.z,
          },
          scale: { x: Damper.scale.x, y: Damper.scale.y, z: Damper.scale.z },
          rotation: {
            x: Damper.rotation.x,
            y: Damper.rotation.y,
            z: Damper.rotation.z,
          },
        };

        // infinite rotation tween
        rotateRef.current = gsap.to(Damper.rotation, {
          z: Math.PI * 2, // or x/y depending on axis
          duration: 6,
          repeat: -1,
          ease: "none",
        });

        // timeline 1 (part1)

        // ---------- REPLACE YOUR OLD TIMELINE WITH THIS BLOCK ----------
        gsap
          .timeline({
            scrollTrigger: {
              trigger: "#part1",
              start: "top 60%",
              end: "bottom bottom",
              scrub: true,
              onEnter: () => {
                // Pause the looping rotation
                const RotateDamper = rotateRef.current;
                if (RotateDamper) RotateDamper.pause();

                // avoid duplicate intervals
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }

                // Start interval events while in part1
                intervalRef.current = setInterval(() => {
                  app.emitEvent("keyDown", "Upper");
                }, 1500);

                // Smooth snap to a clean visible angle (z) and slight tilt (y)
                // This is a one-off visual; timeline's scrubbed transforms (position/scale) stay controlled by the timeline.
                const cleanZ = Math.PI * 3.0; // pick a good face
                gsap.to(Damper.rotation, {
                  z: cleanZ,
                  y: Math.PI / 12,
                  duration: 0.6,
                  ease: "power2.out",
                });
              },
              onLeaveBack: () => {
                // When scrolling back up: return the Damper to its original rotation,
                // resume continuous rotation from the current visible angle, and clear the interval.

                if (!Damper) return;

                // 1) smoothly restore the rotation axes that were changed by onEnter
                gsap.to(Damper.rotation, {
                  x: initialTransform.rotation.x,
                  y: initialTransform.rotation.y,
                  z: initialTransform.rotation.z,
                  duration: 0.5,
                  ease: "power2.out",
                  onComplete: () => {
                    // 2) compute progress based on z-axis and resume looping rotation
                    const twoPi = Math.PI * 2;
                    let currentZ = Damper.rotation.z % twoPi;
                    if (currentZ < 0) currentZ += twoPi;
                    const newProgress = currentZ / twoPi;

                    if (rotateRef.current) {
                      rotateRef.current.progress(newProgress).resume();
                    }
                  },
                });

                // 3) clear the interval started on enter
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              },
            },
          })
          // These position/scale tweens are scrubbed and will reverse automatically when scrolling back
          .to(Damper.position, { x: -50, y: -1270 }, 0)
          .to(Damper.scale, { x: 3, y: 3, z: 3 }, 0);

        // timeline 2 (part2) - SAFE version using Damper instead of keyboard
        // timeline 2 (part2) - SAFE version using Damper instead of keyboard
        // timeline 2 (part2) - start piston on enter, stop on leave
        if (Damper) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: "#part2",
                start: "top bottom",
                end: "center bottom",
                scrub: true,
                // markers: true, // enable while tuning
                onEnter: () => {
                  // defensive clear any previous interval
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }

                  // Immediately tell Spline to start the piston action
                  try {
                    app.emitEvent("mouseDown", "Piston");
                  } catch (e) {
                    console.warn("emitEvent(mouseDown) failed:", e);
                  }

                  // If the Spline action needs repeated emits to keep moving,
                  // start a small interval. If one `mouseDown` is enough, remove the interval below.
                  // adjust interval ms if needed (or remove interval if not required)
                },
                onLeave: () => {
                  // Left part2 going forward: stop the piston
                  try {
                    app.emitEvent("mouseUp", "Piston");
                  } catch (e) {
                    console.warn("emitEvent(mouseUp) failed:", e);
                  }
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }
                },
                onLeaveBack: () => {
                  // Left part2 going back up: also stop the piston
                  try {
                    app.emitEvent("mouseUp", "Piston");
                  } catch (e) {
                    console.warn("emitEvent(mouseUp) failed:", e);
                  }
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }
                },
              },
            })
            // visual rotation/position/scale tweens for the Damper while in part2
            .to(
              Damper.rotation,
              {
                x: Math.PI / 3,
                y: 0,
                z: 0,
                duration: 1,
                ease: "power2.out",
              },
              0
            )
            .to(Damper.position, { x: 400, y: 50 }, 0)
            .to(Damper.scale, { x: 2, y: 2, z: 2 }, 0);
        } else {
          console.warn("Damper not found — skipping timeline 2");
        }

        // // timeline 3 (part3)
        if (Damper) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: "#part3",
                start: "top bottom",
                end: "center bottom",
                scrub: true,
                // markers: true, // enable while tuning
                onEnter: () => {
                  // defensive clear any previous interval
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }

                  // Immediately tell Spline to start the piston action
                  try {
                    app.emitEvent("mouseDown", "Damper");
                  } catch (e) {
                    console.warn("emitEvent(mouseDown) failed:", e);
                  }

                  // If the Spline action needs repeated emits to keep moving,
                  // start a small interval. If one `mouseDown` is enough, remove the interval below.
                  // adjust interval ms if needed (or remove interval if not required)
                },
              },
            })
            // visual rotation/position/scale tweens for the Damper while in part2

            .to(Damper.scale, { x: 0.8, y: 0.8, z: 0.8 }, 0);
        } else {
          console.warn("Damper not found — skipping timeline 2");
        }

        // animate background progress bar
        function animateBar(triggerElement, onEnterWidth, onLeaveBackWidth) {
          gsap.to(".bar", {
            scrollTrigger: {
              trigger: triggerElement,
              start: "top center",
              end: "bottom bottom",
              scrub: true,
              onEnter: () => {
                gsap.to(".bar", {
                  width: onEnterWidth,
                  duration: 0.2,
                  ease: "none",
                });
              },
              onLeaveBack: () => {
                gsap.to(".bar", {
                  width: onLeaveBackWidth,
                  duration: 0.2,
                  ease: "none",
                });
              },
            },
          });
        }

        animateBar("#part1", "35%", "0%");
        animateBar("#part2", "66%", "35%");
        animateBar("#part3", "100%", "65%");
      });

    // keyboard text effect (pressing)
    function pressRandomKey() {
      const keys = document.querySelectorAll(".key");
      if (!keys || keys.length === 0) return;

      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      randomKey.style.animation = "pressDown 0.2s ease-in-out";

      const onEnd = () => {
        randomKey.style.animation = "";
        randomKey.removeEventListener("animationend", onEnd);
        setTimeout(pressRandomKey, 100 + Math.random() * 300);
      };

      randomKey.addEventListener("animationend", onEnd);
    }

    // start pressing after small delay to ensure DOM content rendered
    const pressTimeout = setTimeout(() => {
      pressRandomKey();
    }, 600);

    // cleanup on unmount
    return () => {
      if (appRef.current) {
        try {
          appRef.current.destroy(); // release runtime resources if available
        } catch (e) {}
      }
      if (rotateRef.current) {
        rotateRef.current.kill();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (pressTimeout) clearTimeout(pressTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="canvas-cont">
      <canvas id="canvas3d" ref={canvasRef} />
    </div>
  );
}
