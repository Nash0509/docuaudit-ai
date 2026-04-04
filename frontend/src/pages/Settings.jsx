import Layout from "../components/layout/Layout";
import { useState } from "react";

export default function Settings() {
  const [strictness, setStrictness] = useState("STANDARD");

  const [confidence, setConfidence] = useState(70);

  const [rules, setRules] = useState({
    payment: true,
    liability: true,
    ip: true,
    termination: true,
    nda: true,
  });

  return (
    <Layout>
      <div
        style={{
          maxWidth: "1050px",
          margin: "auto",
        }}
      >
        {/* HEADER */}

        {/* <div
          style={{
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontWeight: "700",
              marginBottom: "6px",
            }}
          >
            Settings
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Manage your DocuAudit AI preferences and system behavior
          </div>
        </div> */}

        {/* ACCOUNT */}

        <Section
          title="Account"
          description="Manage your login and account details"
        >
          <Field label="Email" description="Your registered account email">
            <Input value="user@docuaudit.ai" />
          </Field>

          <Field
            label="Password"
            description="Update your security credentials"
          >
            <button style={buttonSecondary}>Change Password</button>
          </Field>
        </Section>

        {/* AUDIT */}

        <Section
          title="Audit Preferences"
          description="Control how compliance analysis behaves"
        >
          <Field
            label="Audit strictness"
            description="Determines how aggressively violations are flagged"
          >
            <Select
              value={strictness}
              onChange={(e) => setStrictness(e.target.value)}
            >
              <option value="RELAXED">Relaxed</option>
              <option value="STANDARD">Standard</option>
              <option value="STRICT">Strict</option>
            </Select>
          </Field>

          <Field
            label="Confidence threshold"
            description="Minimum AI confidence required before marking failure"
          >
            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <input
                type="range"
                min="50"
                max="95"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                style={{
                  width: "220px",
                }}
              />

              <div
                style={{
                  fontWeight: "600",
                  color: "#e2e8f0",
                }}
              >
                {confidence}%
              </div>
            </div>
          </Field>
        </Section>

        {/* RULES */}

        <Section
          title="Rule Configuration"
          description="Enable or disable compliance checks"
        >
          <Toggle
            text="Payment Terms"
            checked={rules.payment}
            onChange={() => setRules({ ...rules, payment: !rules.payment })}
          />

          <Toggle
            text="Limitation of Liability"
            checked={rules.liability}
            onChange={() => setRules({ ...rules, liability: !rules.liability })}
          />

          <Toggle
            text="IP Ownership"
            checked={rules.ip}
            onChange={() => setRules({ ...rules, ip: !rules.ip })}
          />

          <Toggle
            text="Termination Notice"
            checked={rules.termination}
            onChange={() =>
              setRules({ ...rules, termination: !rules.termination })
            }
          />

          <Toggle
            text="Confidentiality NDA"
            checked={rules.nda}
            onChange={() => setRules({ ...rules, nda: !rules.nda })}
          />
        </Section>

        {/* AI */}

        <Section
          title="AI Settings"
          description="Control how the AI analyzes contracts"
        >
          <Field
            label="Context chunks"
            description="How many document sections AI reads"
          >
            <Select>
              <option>3</option>
              <option>5</option>
              <option>7</option>
              <option>10</option>
            </Select>
          </Field>

          <Field
            label="Analysis depth"
            description="Controls response verbosity"
          >
            <Select>
              <option>Concise</option>
              <option>Balanced</option>
              <option>Detailed</option>
            </Select>
          </Field>
        </Section>

        {/* EXPORT */}

        <Section
          title="Export Preferences"
          description="Control what appears in generated reports"
        >
          <Toggle text="Include recommendations" checked />

          <Toggle text="Include citations" checked />

          <Toggle text="Include confidence score" checked />
        </Section>

        {/* SYSTEM */}

        <Section
          title="System Information"
          description="Current platform configuration"
        >
          <SystemRow label="Product">DocuAudit AI v1.0</SystemRow>

          <SystemRow label="LLM">Llama 3.3 70B</SystemRow>

          <SystemRow label="Vector DB">Chroma</SystemRow>

          <SystemRow label="Embedding">MiniLM</SystemRow>
        </Section>

        {/* SAVE */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "25px",
          }}
        >
          <button style={buttonPrimary}>Save Changes</button>
        </div>
      </div>
    </Layout>
  );
}

function Section({ title, description, children }) {
  return (
    <div
      style={{
        background: "rgba(17,24,39,0.75)",

        borderRadius: "14px",

        padding: "26px",

        border: "1px solid rgba(255,255,255,0.06)",

        marginBottom: "20px",

        boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
      }}
    >
      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            fontSize: "17px",
            fontWeight: "600",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "4px",
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "15px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Field({ label, description, children }) {
  return (
    <div
      style={{
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          marginBottom: "6px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#94a3b8",
          }}
        >
          {description}
        </div>
      </div>

      {children}
    </div>
  );
}

function Toggle({ text, checked, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div>{text}</div>

      <div
        onClick={onChange}
        style={{
          width: "42px",
          height: "22px",
          borderRadius: "20px",
          background: checked ? "#00d4aa" : "#1e293b",
          cursor: "pointer",
          position: "relative",
          transition: "0.2s",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "white",
            position: "absolute",
            top: "2px",
            left: checked ? "22px" : "2px",
            transition: "0.2s",
          }}
        />
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        background: "rgba(255,255,255,0.04)",

        border: "1px solid rgba(255,255,255,0.08)",

        padding: "8px 12px",

        borderRadius: "8px",

        color: "white",

        width: "320px",
      }}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      style={{
        background: "rgba(255,255,255,0.04)",

        border: "1px solid rgba(255,255,255,0.08)",

        padding: "8px 12px",

        borderRadius: "8px",

        color: "white",
      }}
    />
  );
}

function SystemRow({ label, children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#e2e8f0",
          fontWeight: "500",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const buttonPrimary = {
  background: "linear-gradient(135deg,#00d4aa,#2563eb)",

  border: "none",

  padding: "10px 20px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "600",

  color: "#020617",

  fontSize: "14px",
};

const buttonSecondary = {
  background: "rgba(255,255,255,0.04)",

  border: "1px solid rgba(255,255,255,0.08)",

  padding: "8px 14px",

  borderRadius: "8px",

  cursor: "pointer",

  color: "#e2e8f0",
};
