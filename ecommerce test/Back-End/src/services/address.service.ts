import axios from "axios";

export async function lookupCEP(cep: string) {
  const clean = cep.replace(/\D/g, "");
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${clean}/json/`, { timeout: 3000 });
    if (data?.erro) return null;
    return {
      street: data.logradouro || "",
      district: data.bairro || "",
      city: data.localidade || "",
      state: data.uf || "",
      cep: data.cep,
    };
  } catch (err) {
    console.warn("ViaCEP error", err);
    return null;
  }
}
