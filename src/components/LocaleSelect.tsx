import { useLocale } from "../store/useLocale";

export default function LocaleSelect(){

  const { locale, setLocale } = useLocale();

  return (

    <select

      value={locale}

      onChange={(e)=>setLocale(e.target.value as any)}

      className="h-8 px-2 border rounded-lg text-sm bg-white"

      title="언어 / Language"

    >

      <option value="ko">한국어</option>

      <option value="en">English</option>

    </select>

  );

}
