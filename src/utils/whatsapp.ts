// TODO cliente: reemplazar por el número real de WhatsApp de BUNKERGYM
export const WA_NUMBER = '51999999999';

export function waLink(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
