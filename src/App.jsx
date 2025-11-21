import React from "react";
import SplineStage from "./components/SplineStage";
import Section from "./components/Section";
import modelImage from "./assets/images/logo.jpeg";
import pdfFile from "./assets/pdf/report.pdf";

export default function App() {
  return (
    <div className="app scroll-container">
      <div className="bar" />
      <div className="spline-stage">
        <SplineStage />
      </div>

      <div id="hero" className="flex row">
        <h1>
          SMART WRIST ROLLER.
          <br />
          Powered <br />
          <span className="by-text">By</span>
          <div className="keyboard">
            <span className="key">M</span>
            <span className="key">R</span>
            <span className="key">.</span>
            <span className="key">F</span>
            <span className="key">L</span>
            <span className="key">U</span>
            <span className="key">I</span>
            <span className="key">D</span>.
          </div>
        </h1>
      </div>

      <Section id="part1" title="" className="scroll-area">
        <div style={{ width: "30%" }} />
        <div className="part1-info flex column">
          <h2>SEE HOW IT WORKS.</h2>
          <div className="info-block">
            <div className="part">
              <p className="part-title">Load Cell Sensor</p>
              <p className="part-desc">High-precision force measurement.</p>
              <p className="part-desc">
                Captures real-time pulling force applied by the user.
              </p>
              <p className="part-desc">
                Provides the core feedback signal for adaptive resistance.
              </p>
            </div>

            <div className="part">
              <p className="part-title">Flat Support Bracket</p>
              <p className="part-desc">
                Rigid and vibration-isolated mounting.
              </p>
              <p className="part-desc">
                Ensures the load cell receives only axial force.
              </p>
              <p className="part-desc">
                Improves accuracy by eliminating bending errors.
              </p>
            </div>

            <div className="part">
              <p className="part-title">
                Connecting Rod & Piston Shaft — Force Transmission Rod
              </p>
              <p className="part-desc">Direct force transfer.</p>
              <p className="part-desc">
                Links the wrist roller shaft to the load cell.
              </p>
              <p className="part-desc">
                Ensures torque is transmitted cleanly into the sensing system.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="part2" title="" className="scroll-area">
        <div className="part2-info flex column">
          <h3>
            MAGNETORHEOLOGICAL
            <br /> DAMPER(MR) BODY
          </h3>

          <div className="info-block2">
            {/* 5. MR Damper Housing */}
            <div className="part">
              <p className="part-title2">MR Damper Housing</p>
              <p className="part-desc2">Smart resistance engine.</p>
              <p className="part-desc2">
                The main enclosure that holds the MR fluid and structural
                components, maintaining internal pressure and ensuring stable
                operation across varying loads.
              </p>
              <p className="part-desc2">
                Its precisely machined internal chamber allows the fluid to
                respond instantly to magnetic changes, creating smooth,
                controlled, and highly adaptive resistance.
              </p>
            </div>

            {/* 6. Electromagnetic Coil Chamber */}
            <div className="part">
              <p className="part-title2">Electromagnetic Coil Chamber</p>
              <p className="part-desc2">
                Controlled magnetic field generation.
              </p>
              <p className="part-desc2">
                Houses the copper windings that produce magnetic flux, directly
                affecting the viscosity of the MR fluid inside the damper.
              </p>
              <p className="part-desc2">
                By regulating the coil current, the system dynamically adjusts
                resistance levels in real time, enabling programmable damping
                behavior.
              </p>
            </div>

            {/* 7. End Cap / Structural Base */}
            <div className="part">
              <p className="part-title2">End Cap / Structural Base</p>
              <p className="part-desc2">Foundation of the damping system.</p>
              <p className="part-desc2">
                Serves as the closing and support element for the damper,
                sealing the coil chamber and maintaining structural alignment
                for all internal components.
              </p>
              <p className="part-desc2">
                Provides a strong mounting interface for the piston rod and
                ensures the system remains secure, leak-proof, and mechanically
                stable during repetitive usage.
              </p>
            </div>
          </div>
        </div>
        <div style={{ width: "30%" }} />
      </Section>

      <Section id="part3" title="" className="scroll-area">
        <div className="part3-content">
          {/* Image */}
          <img src={modelImage} alt="MR Damper Model" className="part3-image" />
          <p class="thankyou-text">
            Project Guide: Dr.Sandip Tithe
            <br />
            Department of Computer Engineering, 2025–26
            <br />
            Vishwakarma University
            <br />
            <span class="bold">THANK YOU FOR VISITING</span>
          </p>
          {/* Button */}
          <a
            href={pdfFile}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-button"
          >
            VIEW PROJECT REPORT
          </a>
        </div>
      </Section>
      <footer className="footer">
        <p>© 2025 DamperX • Smart MR-Damper Wrist Roller</p>
        {/* <p>
          Developed by <span>Viraj Deshmukh</span>
        </p> */}
        <div className="footer-links">
          <a href="https://github.com/VirajxD0">Github</a>
        </div>
      </footer>
    </div>
  );
}
