// CreateQRCode.jsx
import { QRCode } from "qrcode.react";

const CreateQRCode = ({ code }) => {
  if (!code) return null;

  return (
    <div className="qr-popup">
      <QRCode value={code} size={150} />
      <p className="qr-code-text">{code}</p>
    </div>
  );
};

export default CreateQRCode;
