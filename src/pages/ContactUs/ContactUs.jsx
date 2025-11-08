import React, { useState, useEffect } from "react";
import styles from "./ContactUs.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import emailjs from "@emailjs/browser";

/* ---------- EmailJS config (keep your keys as before) ---------- */
const EMAILJS_SERVICE_ID = "service_x2sp6m2";
const EMAILJS_TEMPLATE_ID = "template_2nrzrcd";
const EMAILJS_PUBLIC_KEY = "NEgO9KY7bvlPOXsIU";

export default function ContactUs({
  lat = 17.444,
  lng = 78.388,
  socialLinks = [
    {
      href: "https://instagram.com",
      imgSrc: "/icons/instagram.png",
      alt: "Instagram",
    },
    {
      href: "https://linkedin.com",
      imgSrc: "/icons/linkedin.png",
      alt: "LinkedIn",
    },
    {
      href: "https://twitter.com",
      imgSrc: "/icons/twitter.png",
      alt: "Twitter",
    },
    {
      href: "https://youtube.com",
      imgSrc: "/icons/youtube.png",
      alt: "YouTube",
    },
    {
      href: "https://facebook.com",
      imgSrc: "/icons/facebook.png",
      alt: "Facebook",
    },
  ],
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log("EmailJS initialized with public key:", EMAILJS_PUBLIC_KEY);
    } catch (err) {
      console.error("EmailJS init error:", err);
    }
  }, []);

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  const buildMailToHref = () => {
    const subject = encodeURIComponent(
      `Website Contact from ${form.name || "Guest"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    );
    return `mailto:sr7022476@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", msg: "Please fill name, email and message." });
      return;
    }

    setSending(true);
    try {
      const templateParams = {
        name: form.name,
        email: form.email,
        phone: form.phone || "-",
        message: form.message,
      };

      const resp = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      console.log("EmailJS send success:", resp);
      setStatus({ type: "success", msg: "Message sent. Thank you!" });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("EmailJS send error (full):", err);
      if (err && err.status) console.error("Status:", err.status);
      if (err && err.text) console.error("Text:", err.text);

      setStatus({
        type: "error",
        msg: "Send failed. Opening your email client as fallback. Check console & EmailJS dashboard for details.",
      });

      setTimeout(() => (window.location.href = buildMailToHref()), 700);
    } finally {
      setSending(false);
    }
  };

  const mapSrc = `https://www.google.com/maps?q=Brain%20Buzz%20Academy,+Plot+No+45,+TGIIC+Rd,+Mythri+Nagar,+Kukatpally,+Hyderabad,+Telangana+500072&z=15&output=embed`;


  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {/* Top row: title + icons */}
        <div className={styles.topRow}>
          <h2 className={styles.title}>Contact Us</h2>

          <div className={styles.headerIcons}>
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <img
                  src={s.imgSrc}
                  alt={s.alt || `social-${i}`}
                  className={styles.socialIcon}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Two column grid: map left, form right (50/50, equal height) */}
        <div className={styles.grid}>
          {/* Left: Map */}
          {/* Left: Map (with info card overlay) */}
          <div className={styles.mapWrap}>
            {/* Info card overlay - top-left */}
            <div className={styles.mapInfo}>
              <div className={styles.mapInfoTitle}>Brain Buzz Academy</div>
              <div className={styles.mapInfoAddress}>
                Plot No 45, TGIIC Rd, behind Metro,
                <br />
                Vignanapuri Colony, Mythri Nagar,
                <br />
                Kukatpally, Hyderabad,
                <br />
                Telangana 500072
              </div>

              <div className={styles.mapInfoRow}>
                <div className={styles.mapInfoRating}>
                  <strong>5.0</strong>
                  <span className={styles.stars}>★★★★★</span>
                </div>
                <div className={styles.mapInfoReviews}>10 Reviews</div>
              </div>

              <a
                className={styles.mapInfoLink}
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Longer Map
              </a>
            </div>

            {/* Map iframe */}
            <iframe
              title="location-map"
              src={mapSrc}
              className={styles.mapIframe}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Right: Form */}
          <div className={styles.formWrap}>
            <div className={styles.formCard}>
              <div>
                <h3 className={styles.formTitle}>Lets get in Touch with Us</h3>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formInner}>
                    <Input
                      type="text"
                      placeholder="Enter Your Name"
                      value={form.name}
                      onChange={handleChange("name")}
                    />
                    <Input
                      type="email"
                      placeholder="Enter Your Email"
                      value={form.email}
                      onChange={handleChange("email")}
                    />
                    <Input
                      type="text"
                      placeholder="Enter 10 Digit Mobile Number"
                      value={form.phone}
                      onChange={handleChange("phone")}
                    />
                    <Input
                      textarea
                      placeholder="Message...."
                      value={form.message}
                      onChange={handleChange("message")}
                    />
                  </div>

                  {status && (
                    <div
                      className={
                        status.type === "success"
                          ? styles.successText
                          : styles.errorText
                      }
                      role="alert"
                    >
                      {status.msg}
                    </div>
                  )}

                  <div className={styles.formActions}>
                    <Button
                      label={sending ? "Sending..." : "Send Now"}
                      type="submit"
                      fullWidth
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (kept same) */}
        {/* Footer info (redesigned to match your design screenshots) */}
        <div className={styles.footerInfo}>
          <h3 className={styles.helpTitle}>
            Have any questions about our courses?
          </h3>
          <p className={styles.helpSubtitle}>
            Our support team is here to help you
          </p>

          <a href="/contact" className={styles.contactUsBtn}>
            CONTACT US
          </a>

          <p className={styles.footerLine}>
            <span className={styles.footerLabel}>Toll Free :</span>{" "}
            <span>1-866-996-9642</span>
          </p>

          <p className={styles.footerLine}>
            <span className={styles.footerLabel}>Email ID :</span>{" "}
            <span>brainbuzzacademy@gmail.com</span>
          </p>

          <div className={styles.footerLinks}>
            <a href="#livechat">Live Chat</a>
            <a href="mailto:brainbuzzacademy@gmail.com">Email Us</a>
            <a href="#book">Book an Appointment</a>
          </div>
        </div>
      </div>
    </section>
  );
}
