"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT, SITE } from "@/lib/data";
import { useT } from "@/lib/i18n";

type Field = "name" | "email" | "subject" | "message";
const RULES: Record<Field, { test: (v: string) => boolean; hint: string; hintEn: string }> = {
  name: { test: (v) => /^[\p{L}][\p{L}\s'.-]{1,59}$/u.test(v.trim()), hint: "Solo letras, de 2 a 60 caracteres.", hintEn: "Letters only, 2 to 60 characters." },
  email: { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), hint: "Un correo válido, por ejemplo nombre@correo.com.", hintEn: "A valid email, e.g. name@email.com." },
  subject: { test: (v) => v.trim().length >= 3 && v.trim().length <= 80, hint: "Entre 3 y 80 caracteres.", hintEn: "Between 3 and 80 characters." },
  message: { test: (v) => v.trim().length >= 20 && v.trim().length <= 1000, hint: "Entre 20 y 1000 caracteres.", hintEn: "Between 20 and 1000 characters." },
};

/** Clave pública de Web3Forms (se configura en Vercel como variable de entorno). */
const FORM_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

export default function Contact() {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const copyT = useRef<number | undefined>(undefined);
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", subject: "", message: "" });
  const [touched, setTouched] = useState<Record<Field, boolean>>({ name: false, email: false, subject: false, message: false });
  const [status, setStatus] = useState<string>("");
  const [sending, setSending] = useState(false);

  useEffect(() => () => window.clearTimeout(copyT.current), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard?.writeText(CONTACT.email);
    } catch {
      /* el portapapeles puede estar bloqueado */
    }
    setCopied(true);
    window.clearTimeout(copyT.current);
    copyT.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const valid = (f: Field) => RULES[f].test(values[f]);
  const invalid = (f: Field) => touched[f] && !valid(f);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setTouched({ name: true, email: true, subject: true, message: true });
    const fields = Object.keys(RULES) as Field[];
    const firstBad = fields.find((f) => !valid(f));
    if (firstBad) {
      setStatus(t("Revisa los campos marcados.", "Please check the highlighted fields."));
      document.getElementById(`c-${firstBad}`)?.focus();
      return;
    }
    const first = values.name.trim().split(" ")[0];

    // Sin clave configurada: se abre la app de correo con el mensaje listo.
    if (!FORM_KEY) {
      const body = `${values.message}\n\n— ${values.name} (${values.email})`;
      setStatus(t(`¡Listo, ${first}! Tu mensaje está preparado en tu app de correo. Si no se abrió, escríbeme a ${CONTACT.email}.`, `All set, ${first}! Your message is ready in your email app. If it didn't open, write to me at ${CONTACT.email}.`));
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    // Con Web3Forms: el mensaje llega directo al correo de Laura.
    const honey = (e.currentTarget.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked;
    if (honey) return;
    setSending(true);
    setStatus(t("Enviando tu mensaje…", "Sending your message…"));
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: `Portafolio · ${values.subject.trim()}`,
          from_name: "Portafolio de Laura Escobar",
          name: values.name.trim(),
          email: values.email.trim(),
          replyto: values.email.trim(),
          asunto: values.subject.trim(),
          message: values.message.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || !data.success) throw new Error("send");
      setStatus(t(`¡Gracias, ${first}! Tu mensaje me llegó. Te respondo muy pronto.`, `Thank you, ${first}! I got your message. I'll reply very soon.`));
      setValues({ name: "", email: "", subject: "", message: "" });
      setTouched({ name: false, email: false, subject: false, message: false });
    } catch {
      setStatus(t(`No se pudo enviar. Inténtalo otra vez o escríbeme a ${CONTACT.email}.`, `It couldn't be sent. Try again or write to me at ${CONTACT.email}.`));
    } finally {
      setSending(false);
    }
  };

  const input = (f: Field, label: string, placeholder: string, type = "text", wide = false) => {
    const bad = invalid(f);
    const ok = touched[f] && valid(f);
    const common = {
      id: `c-${f}`,
      name: f,
      className: `field ${bad ? "is-bad" : ""} ${ok ? "is-ok" : ""}`,
      placeholder,
      value: values[f],
      "aria-invalid": bad || undefined,
      "aria-describedby": `c-${f}-hint`,
      onChange: (ev: { target: { value: string } }) => setValues((v) => ({ ...v, [f]: ev.target.value })),
      onBlur: () => setTouched((t) => ({ ...t, [f]: true })),
    };
    return (
      <div className={`fgroup ${wide ? "fgroup--wide" : ""}`}>
        <label htmlFor={`c-${f}`} className="flabel">
          {label}
        </label>
        {f === "message" ? (
          <textarea {...common} rows={4} maxLength={1000} />
        ) : (
          <input {...common} type={type} autoComplete={f === "name" ? "name" : f === "email" ? "email" : "off"} />
        )}
        <div id={`c-${f}-hint`} className={`fhint ${bad ? "is-bad" : ""} ${ok ? "is-ok" : ""}`}>
          <span aria-hidden="true">{bad ? "✕ " : ok ? "✓ " : ""}</span>
          {t(RULES[f].hint, RULES[f].hintEn)}
          {f === "message" ? <span className="fcount"> {values.message.trim().length}/1000</span> : null}
        </div>
      </div>
    );
  };

  return (
    <section id="contacto" ref={section} className="contact">

      <div className="wrap contact-inner">
        <div className="contact-labels">
          <span>(09) — {t("Contacto", "Contact")}</span>
        </div>
        <h2 className="contact-title serif letters">
          {t("Hablemos", "Let's talk").split("").map((l, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>
              {l === " " ? "\u00A0" : l}
            </span>
          ))}
          <span className="contact-dot" style={{ animationDelay: `${8 * 0.05}s` }}>
            .
          </span>
        </h2>

        <div className="contact-grid">
          <div>
            <p className="contact-lead">{t("¿Tienes una oportunidad de práctica, un proyecto o una pregunta? Escríbeme.", "Have an internship opportunity, a project or a question? Write to me.")}</p>
            <div className="contact-mail">
              <span>{CONTACT.email}</span>
              <button type="button" onClick={onCopy} className={`copy-btn ${copied ? "is-copied" : ""}`}>
                {copied ? t("✓ COPIADO", "✓ COPIED") : t("COPIAR", "COPY")}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? t("Correo copiado al portapapeles", "Email copied to clipboard") : ""}
              </span>
            </div>
            <div className="contact-rows">
              <a href={CONTACT.linkedin.href} className="crow" target="_blank" rel="noreferrer">
                <span>LinkedIn</span>
                <span>
                  {CONTACT.linkedin.label} <span aria-hidden="true">↗</span>
                </span>
              </a>
              <a href={CONTACT.github.href} className="crow" target="_blank" rel="noreferrer">
                <span>GitHub</span>
                <span>
                  {CONTACT.github.label} <span aria-hidden="true">↗</span>
                </span>
              </a>
              <a href={SITE.cv} className="crow" download>
                <span>{t("Hoja de vida", "Résumé")}</span>
                <span>
                  {t("Descargar CV (PDF)", "Download CV (PDF)")} <span aria-hidden="true">↓</span>
                </span>
              </a>
              <a href={`mailto:${CONTACT.email}`} className="crow">
                <span>{t("Correo", "Email")}</span>
                <span>
                  {CONTACT.email} <span aria-hidden="true">↗</span>
                </span>
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={onSubmit} noValidate>
            {input("name", t("Nombre", "Name"), t("Tu nombre", "Your name"))}
            {input("email", t("Correo", "Email"), t("tu@correo.com", "you@email.com"), "email")}
            {input("subject", t("Asunto", "Subject"), t("¿De qué quieres hablar?", "What would you like to talk about?"), "text", true)}
            {input("message", t("Mensaje", "Message"), t("Escribe tu mensaje (mínimo 20 caracteres)", "Write your message (at least 20 characters)"), "text", true)}
            <input type="checkbox" name="botcheck" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="fgroup--wide form-foot">
              <button className="btn btn-light magnetic" type="submit" disabled={sending} aria-busy={sending}>
                {sending ? t("Enviando…", "Sending…") : t("Enviar mensaje", "Send message")} <span aria-hidden="true" className="btn-arrow">→</span>
              </button>
              <p className="form-status" role="status">
                {status}
              </p>
            </div>
          </form>
        </div>
      </div>

    </section>
  );
}
