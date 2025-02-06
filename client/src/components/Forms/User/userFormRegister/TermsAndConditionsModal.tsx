import { Dialog } from 'primereact/dialog';
import { useTranslation } from 'react-i18next';

type TermsAndConditionsModalProps = {
  visible: boolean;
  onHide: () => void;
};

const TermsAndConditionsModal = ({ visible, onHide }: TermsAndConditionsModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      header={t("Terms and Conditions")}
      visible={visible}
      onHide={onHide}
      style={{ width: '50vw' }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
    >
      <div className="mt-4 text-sm space-y-4">
        <h3 className="font-bold text-lg">{t("1. Acceptance of Terms")}</h3>
        <p>{t("By accessing and using this application, you agree to be bound by these terms and conditions.")}</p>

        <h3 className="font-bold text-lg">{t("2. User Responsibilities")}</h3>
        <p>{t("Users are responsible for maintaining the confidentiality of their account information.")}</p>

        <h3 className="font-bold text-lg">{t("3. Privacy Policy")}</h3>
        <p>{t("Your use of the application is also governed by our Privacy Policy.")}</p>

        {/* Добавете повече секции според нуждите */}
      </div>
    </Dialog>
  );
};

export default TermsAndConditionsModal; 