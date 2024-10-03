import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";

const EmailVerified: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("email_verified_title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("email_verified_description")}
          </p>
        </div>
        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("go_to_login")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const acceptLanguage = req.headers["accept-language"];
  let detectedLocale = locale;

  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(",")[0].split("-")[0];
    if (["en", "es"].includes(preferredLocale)) {
      detectedLocale = preferredLocale;
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(detectedLocale ?? "en", ["common"])),
    },
  };
};

export default EmailVerified;
