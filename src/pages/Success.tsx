import { useT } from "../i18n";

export default function Success() {

  const { t } = useT();

  return (

    <div className="mx-auto max-w-3xl p-6 text-center">

      <h1 className="text-2xl font-bold mb-4">Payment Success!</h1>

      <p className="text-gray-600">

        결제 완료! 잔액 반영까지 잠시 기다려주세요.

      </p>

      <p className="text-sm text-gray-500 mt-2">

        Credits will be added shortly.

      </p>

    </div>

  );

}
