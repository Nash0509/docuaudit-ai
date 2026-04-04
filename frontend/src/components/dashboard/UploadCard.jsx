import Card from "../ui/Card";

import Button from "../ui/Button";

export default function UploadCard() {
  return (
    <Card>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "18px",

            fontWeight: "600",
          }}
        >
          Upload Contract
        </div>

        <div
          style={{
            fontSize: "13px",

            color: "#64748b",

            marginTop: "6px",
          }}
        >
          Drop contract to start AI audit
        </div>

        <div
          style={{
            marginTop: "18px",
          }}
        >
          <Button>Upload Document</Button>
        </div>
      </div>
    </Card>
  );
}
