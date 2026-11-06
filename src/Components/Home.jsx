import React from "react";
import style from "../Styles/home.module.css";
import Navbar from "./Navbar";

function Home() {
  const modules = [
    {
      icon: "🔐",
      title: "Authentication",
      description:
        "Secure student registration and separate student and admin login with role-based access.",
    },
    {
      icon: "🏢",
      title: "Company Management",
      description:
        "Explore companies, view job openings, placement drives, eligibility criteria and package details.",
    },
    {
      icon: "📋",
      title: "Application Tracking",
      description:
        "Apply for placement opportunities and track every application from submission to final selection.",
    },
    {
      icon: "📊",
      title: "Dashboard",
      description:
        "Get an overview of companies, available jobs, applications, offers and placement updates.",
    },
    {
      icon: "📈",
      title: "Reports & Analytics",
      description:
        "Analyze application counts, accepted and rejected applications, interviews and offers received.",
    },
    {
      icon: "🔔",
      title: "Notifications",
      description:
        "Stay updated with application status changes, interview schedules and placement announcements.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Register or Login",
      description:
        "Students create an account and log in to access their placement dashboard.",
    },
    {
      number: "02",
      title: "Explore Opportunities",
      description:
        "Browse companies, job openings, placement drives and eligibility criteria.",
    },
    {
      number: "03",
      title: "Apply for Jobs",
      description: "Submit applications for suitable placement opportunities.",
    },
    {
      number: "04",
      title: "Track Your Progress",
      description:
        "Monitor application statuses, interview updates and final offers.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className={style.placementHome}>
        {/* Navbar */}

        {/* Hero Section */}
        <section className={style.heroSection} id="home">
          <div className={style.heroContent}>
            <span className={style.heroTag}>
              YOUR CAREER JOURNEY STARTS HERE
            </span>

            <h1>
              Manage Your Placement Journey
              <span> All in One Place.</span>
            </h1>

            <p>
              Placement Tracker is a centralized platform that helps students
              discover job opportunities, apply for companies, track application
              statuses and monitor their placement progress with ease.
            </p>

            <div className={style.heroButtons}>
              <a href="/login" className={style.primaryBtn}>
                Get Started <span>→</span>
              </a>
            </div>

            <div className={style.heroPoints}>
              <span>✓ Application Tracking</span>
              <span>✓ Placement Updates</span>
              <span>✓ Career Progress</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          className={`${style.featuresSection} ${style.sectionPadding}`}
          id="features"
        >
          <div className={style.sectionHeading}>
            <span className={style.sectionLabel}>WHAT YOU GET</span>
            <h2>Everything You Need to Track Placements</h2>
            <p>
              Essential tools to make the placement process simple, transparent
              and organized.
            </p>
          </div>

          <div className={style.featureGrid}>
            {modules.map((module, index) => (
              <div className={style.featureCard} key={index}>
                <div className={style.featureIcon}>{module.icon}</div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modules */}
        <section
          className={`${style.modulesSection} ${style.sectionPadding}`}
          id="modules"
        >
          <div className={style.sectionHeading}>
            <span className={style.sectionLabel}>APPLICATION MODULES</span>
            <h2>Designed for Every Placement Activity</h2>
            <p>
              The platform brings all major placement activities together in a
              single system.
            </p>
          </div>

          <div className={style.moduleList}>
            <div className={style.moduleItem}>
              <span>01</span>
              <div>
                <h3>Authentication Module</h3>
                <p>
                  Student registration, student login, admin login and
                  role-based access control.
                </p>
              </div>
            </div>

            <div className={style.moduleItem}>
              <span>02</span>
              <div>
                <h3>Companies and Placement Drives</h3>
                <p>
                  Manage company profiles, job roles, eligibility criteria,
                  package details and application deadlines.
                </p>
              </div>
            </div>

            <div className={style.moduleItem}>
              <span>03</span>
              <div>
                <h3>Application Management</h3>
                <p>
                  Submit applications, monitor progress and update application
                  statuses.
                </p>
              </div>
            </div>

            <div className={style.moduleItem}>
              <span>04</span>
              <div>
                <h3>Dashboard Management</h3>
                <p>
                  Display placement updates, companies, available jobs,
                  applications and offers.
                </p>
              </div>
            </div>

            <div className={style.moduleItem}>
              <span>05</span>
              <div>
                <h3>Reports and Analytics</h3>
                <p>
                  View total applications, accepted and rejected applications,
                  interviews and offers received.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className={`${style.workflowSection} ${style.sectionPadding}`}>
          <div className={style.sectionHeading}>
            <span className={style.sectionLabel}>HOW IT WORKS</span>
            <h2>Your Placement Journey in Four Steps</h2>
            <p>
              Follow a simple process from account creation to placement
              tracking.
            </p>
          </div>

          <div className={style.workflowGrid}>
            {steps.map((step, index) => (
              <div className={style.workflowCard} key={index}>
                <span className={style.workflowNumber}>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={style.ctaSection}>
          <div>
            <span>START YOUR JOURNEY TODAY</span>
            <h2>Take the Next Step Towards Your Career.</h2>
            <p>
              Stay organized, explore opportunities and keep track of every step
              in your placement journey.
            </p>
          </div>

          <a href="/register/personaldetails" className={style.ctaButton}>
            Get Started Now →
          </a>
        </section>

        {/* Footer */}
        <footer className={style.homeFooter} id="contact">
          <div className={style.footerMain}>
            <div className={style.footerBrand}>
              <a href="#home" className={style.homeLogo}>
                <span className={style.logoIcon}>P</span>
                <span>
                  Place<span className={style.logoHighlight}>Track</span>
                </span>
              </a>

              <p>
                A centralized platform to simplify student placement management
                and career tracking.
              </p>
            </div>

            <div className={style.footerLinks}>
              <h4>Quick Links</h4>
              <a href="#home">Home</a>
              <a href="#features">Features</a>
              <a href="#modules">Modules</a>
            </div>

            <div className={style.footerLinks}>
              <h4>Account</h4>
              <a href="/login">Student Login</a>
              <a href="/register/personaldetails">Student Registration</a>
            </div>
          </div>

          <div className={style.footerBottom}>
            <p>© {new Date().getFullYear()} PlaceTrack. All rights reserved.</p>
            <p>Designed to make placement management easier.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
