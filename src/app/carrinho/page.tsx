"use client";

import "../cart-reference.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

type Item = {
  id: string;
  name: string;
  price_cents: number;
  quantity: number;
  image_url?: string;
};

const KEY = "agora-fide-cart";
const brl = (cents: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);

export default function Carrinho() {
  const [items, setItems] = useState<Item[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      setItems([]);
    }
  }, []);

  function save(next: Item[]) {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("agora-cart"));
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <AppShell>
      <div className="cart-ref">
        {items.length ? (
          <>
            <section className="cart-ref-intro">
              <small>LOJA VINDE</small>
              <div className="cart-ref-intro-row">
                <div>
                  <h1>Seu carrinho</h1>
                  <p>
                    {count} {count === 1 ? "item selecionado" : "itens selecionados"}
                  </p>
                </div>
                <div className="cart-ref-count" aria-label={`${count} itens no carrinho`}>
                  <ShoppingBag size={18} />
                  <span>{count}</span>
                </div>
              </div>
            </section>

            <section className="cart-ref-products-block">
              <div className="cart-ref-head">
                <h2>Itens</h2>
                <button
                  type="button"
                  onClick={() => {
                    save([]);
                    setNotice("");
                  }}
                >
                  Limpar carrinho
                </button>
              </div>

              <div className="cart-ref-items">
                {items.map((item, index) => (
                  <article className="cart-ref-item" key={item.id}>
                    <div className="cart-ref-image">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          sizes="104px"
                          loading={index === 0 ? "eager" : "lazy"}
                          priority={index === 0}
                          unoptimized
                        />
                      ) : (
                        <ShoppingBag size={30} />
                      )}
                    </div>

                    <div className="cart-ref-info">
                      <div className="cart-ref-name">
                        <div>
                          <span>LOJA VINDE</span>
                          <h3>{item.name}</h3>
                        </div>
                        <button
                          className="cart-ref-remove-top"
                          aria-label={`Remover ${item.name}`}
                          onClick={() => save(items.filter((x) => x.id !== item.id))}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <strong>{brl(item.price_cents)}</strong>

                      <div className="cart-ref-actions">
                        <div className="cart-ref-qty" aria-label={`Quantidade de ${item.name}`}>
                          <button
                            aria-label={`Diminuir quantidade de ${item.name}`}
                            onClick={() =>
                              save(
                                items.map((x) =>
                                  x.id === item.id
                                    ? { ...x, quantity: Math.max(1, x.quantity - 1) }
                                    : x
                                )
                              )
                            }
                          >
                            <Minus size={15} />
                          </button>
                          <b>{item.quantity}</b>
                          <button
                            aria-label={`Aumentar quantidade de ${item.name}`}
                            onClick={() =>
                              save(
                                items.map((x) =>
                                  x.id === item.id
                                    ? { ...x, quantity: x.quantity + 1 }
                                    : x
                                )
                              )
                            }
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <span className="cart-ref-item-total">
                          {item.quantity > 1 ? brl(item.price_cents * item.quantity) : ""}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Link href="/loja" className="cart-ref-more">
                <Plus size={15} />
                Continuar escolhendo
              </Link>
            </section>

            <section className="cart-ref-summary">
              <div className="cart-ref-summary-title">
                <div className="cart-ref-summary-icon">
                  <ShoppingBag size={19} />
                </div>
                <div>
                  <small>RESUMO DO PEDIDO</small>
                  <h2>Seu pedido</h2>
                </div>
              </div>

              <div className="cart-ref-summary-line">
                <span>Subtotal</span>
                <strong>{brl(subtotal)}</strong>
              </div>

              <div className="cart-ref-summary-line">
                <span className="cart-ref-freight">
                  <Truck size={17} /> Frete
                </span>
                <button
                  type="button"
                  onClick={() => setNotice("O frete será calculado na próxima etapa.")}
                >
                  Calcular
                </button>
              </div>

              <div className="cart-ref-divider" />

              <div className="cart-ref-total">
                <div>
                  <span>Total</span>
                  <small>sem o frete</small>
                </div>
                <strong>{brl(subtotal)}</strong>
              </div>

              {notice && (
                <p className="cart-ref-notice" role="status">
                  <Check size={14} /> {notice}
                </p>
              )}

              <button
                className="cart-ref-checkout"
                onClick={() =>
                  setNotice("O checkout financeiro ainda não está habilitado no piloto.")
                }
              >
                Finalizar compra <ArrowRight size={20} />
              </button>

              <p className="cart-ref-secure">
                <ShieldCheck size={15} /> Compra segura dentro do Vinde
              </p>
            </section>
          </>
        ) : (
          <section className="cart-ref-empty">
            <div className="cart-ref-empty-icon">
              <ShoppingBag size={29} />
            </div>
            <small>SEU CARRINHO</small>
            <h1>Seu carrinho está vazio.</h1>
            <p>
              Encontre presentes, livros e objetos escolhidos para acompanhar sua caminhada de fé.
            </p>
            <Link href="/loja">
              Explorar a loja <ArrowRight size={18} />
            </Link>
          </section>
        )}
      </div>
    </AppShell>
  );
}
