'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Edit3,
  Image as ImageIcon,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  '/api';

type Variant = {
  id?: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
};

type ProductImage = {
  id?: string;
  url: string;
  altText?: string;
  type?: string;
  publicId?: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number | string;
  mrp?: number | string;
  published: boolean;
  featured: boolean;
  fabric?: string;
  gsm?: string;
  fit?: string;
  careInstructions?: string;
  seoTitle?: string;
  seoDescription?: string;
  images?: ProductImage[];
  variants?: Variant[];
};

type AdminTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'media';

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  mrp: 0,
  published: false,
  featured: false,
  fabric: '',
  gsm: '',
  fit: '',
  careInstructions: '',
  seoTitle: '',
  seoDescription: '',
  images: [],
  variants: [
    {
      sku: '',
      color: 'Black',
      size: 'M',
      stock: 0,
    },
  ],
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] =
    useState(false);

  const [checking, setChecking] = useState(true);

  const [backendError, setBackendError] =
    useState('');

  const [email, setEmail] =
    useState('admin@dravon.in');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [tab, setTab] =
    useState<AdminTab>('dashboard');

  const [dashboard, setDashboard] =
    useState<any>(null);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [orders, setOrders] =
    useState<any[]>([]);

  const [query, setQuery] =
    useState('');

  const [editor, setEditor] =
    useState<
      (Omit<Product, 'id'> & { id?: string }) | null
    >(null);

  const [saving, setSaving] =
    useState(false);

  const [notice, setNotice] =
    useState('');

  const [loadingData, setLoadingData] =
    useState(false);

  async function api(
    path: string,
    options: RequestInit = {},
    timeoutMs = 15000
  ) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(`${API}${path}`, {
        ...options,
        credentials: 'include',
        signal: controller.signal,
        headers: {
          ...(options.body &&
          !(options.body instanceof FormData)
            ? {
                'Content-Type':
                  'application/json',
              }
            : {}),
          ...(options.headers || {}),
        },
      });

      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function readJson(
    response: Response
  ) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  async function loadAll(
    showLoader = true
  ) {
    if (showLoader) {
      setChecking(true);
    }

    setBackendError('');

    try {
      const me = await api('/auth/me');

      if (me.status === 401 || me.status === 403) {
        setAuthenticated(false);
        setDashboard(null);
        setProducts([]);

        if (showLoader) {
          setChecking(false);
        }

        return;
      }

      if (!me.ok) {
        const data = await readJson(me);

        throw new Error(
          data?.message ||
            `Backend returned HTTP ${me.status}`
        );
      }

      setAuthenticated(true);

      const [dashboardResponse, productsResponse] =
        await Promise.all([
          api('/admin/dashboard'),
          api(
            `/products?q=${encodeURIComponent(
              query
            )}`
          ),
        ]);

      if (!dashboardResponse.ok) {
        const data =
          await readJson(dashboardResponse);

        throw new Error(
          data?.message ||
            `Dashboard request failed (${dashboardResponse.status})`
        );
      }

      if (!productsResponse.ok) {
        const data =
          await readJson(productsResponse);

        throw new Error(
          data?.message ||
            `Products request failed (${productsResponse.status})`
        );
      }

      const dashboardData =
        await dashboardResponse.json();

      const productsData =
        await productsResponse.json();

      setDashboard(dashboardData);

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );
    } catch (err: any) {
      console.error(
        'DRAVON ADMIN LOAD ERROR:',
        err
      );

      setAuthenticated(false);
      setDashboard(null);
      setProducts([]);

      if (
        err?.name === 'AbortError'
      ) {
        setBackendError(
          `Backend request timed out.

Make sure the Render API is running.

API:
${API}`
        );
      } else {
        setBackendError(
          `Could not connect to the DRAVON backend.

API:
${API}

Error:
${err?.message || 'Unknown error'}`
        );
      }
    } finally {
      if (showLoader) {
        setChecking(false);
      }
    }
  }

  useEffect(() => {
    loadAll(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    const timer = setTimeout(() => {
      loadAll(false);
    }, 350);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function login(
    event: FormEvent
  ) {
    event.preventDefault();

    setError('');
    setBackendError('');

    if (!email.trim() || !password) {
      setError(
        'Enter your admin email and password.'
      );
      return;
    }

    try {
      const response = await api(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await readJson(response);

      if (!response.ok) {
        setError(
          data?.message ||
            'Invalid admin email or password.'
        );
        return;
      }

      setPassword('');
      setError('');

      await new Promise((resolve) =>
        setTimeout(resolve, 150)
      );

      await loadAll(true);
    } catch (err: any) {
      console.error(
        'DRAVON LOGIN ERROR:',
        err
      );

      if (
        err?.name === 'AbortError'
      ) {
        setError(
          'Backend timed out. Render may still be waking up. Try again.'
        );
      } else {
        setError(
          `Could not reach backend.

${err?.message || 'Network error'}`
        );
      }
    }
  }

  async function logout() {
    try {
      await api(
        '/auth/logout',
        {
          method: 'POST',
        }
      );
    } catch {
      // Ignore logout request errors.
    }

    setAuthenticated(false);
    setDashboard(null);
    setProducts([]);
    setOrders([]);
    setTab('dashboard');
  }

  async function loadOrders() {
    try {
      setLoadingData(true);

      const response =
        await api('/admin/orders');

      if (!response.ok) {
        const data =
          await readJson(response);

        setNotice(
          data?.message ||
            'Could not load orders.'
        );

        return;
      }

      const data =
        await response.json();

      setOrders(
        Array.isArray(data) ? data : []
      );
    } catch (err: any) {
      console.error(
        'ORDER LOAD ERROR:',
        err
      );

      setNotice(
        err?.name === 'AbortError'
          ? 'Orders request timed out.'
          : 'Could not load orders.'
      );
    } finally {
      setLoadingData(false);
    }
  }

  function openNew() {
    setEditor({
      ...emptyProduct,
      variants: [
        {
          sku: `DRV-${Date.now()}`,
          color: 'Black',
          size: 'M',
          stock: 0,
        },
      ],
    });
  }

  function openEdit(
    product: Product
  ) {
    setEditor({
      ...product,

      price: Number(product.price),

      mrp: Number(product.mrp || 0),

      images: (product.images || []).map(
        (image) => ({
          id: image.id,
          url: image.url,
          altText:
            image.altText || '',
          type:
            image.type || 'image',
          publicId:
            image.publicId,
        })
      ),

      variants: (
        product.variants || []
      ).map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        stock: Number(
          variant.stock
        ),
      })),
    });
  }

  function updateEditor<
    K extends keyof Product
  >(
    key: K,
    value: Product[K]
  ) {
    setEditor((current) =>
      current
        ? {
            ...current,
            [key]: value,
          }
        : current
    );
  }

  async function saveProduct(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!editor) return;

    setSaving(true);
    setNotice('');

    try {
      const payload = {
        name: editor.name.trim(),

        slug: editor.slug
          .trim()
          .toLowerCase(),

        description:
          editor.description || '',

        price: Number(
          editor.price
        ),

        mrp: Number(
          editor.mrp || 0
        ),

        published:
          !!editor.published,

        featured:
          !!editor.featured,

        fabric:
          editor.fabric || '',

        gsm:
          editor.gsm || '',

        fit:
          editor.fit || '',

        careInstructions:
          editor.careInstructions ||
          '',

        seoTitle:
          editor.seoTitle || '',

        seoDescription:
          editor.seoDescription ||
          '',

        images: (
          editor.images || []
        )
          .filter(
            (image) =>
              image.url.trim()
          )
          .map((image) => ({
            url: image.url.trim(),

            altText:
              image.altText || '',

            type:
              image.type ||
              'image',

            ...(image.publicId
              ? {
                  publicId:
                    image.publicId,
                }
              : {}),
          })),

        variants: (
          editor.variants || []
        )
          .filter(
            (variant) =>
              variant.sku.trim() &&
              variant.color.trim() &&
              variant.size.trim()
          )
          .map((variant) => ({
            sku: variant.sku.trim(),

            color:
              variant.color.trim(),

            size:
              variant.size.trim(),

            stock: Math.max(
              0,
              Number(
                variant.stock
              ) || 0
            ),
          })),
      };

      const response =
        editor.id
          ? await api(
              `/products/${editor.id}`,
              {
                method: 'PUT',
                body: JSON.stringify(
                  payload
                ),
              }
            )
          : await api(
              '/products',
              {
                method: 'POST',
                body: JSON.stringify(
                  payload
                ),
              }
            );

      const data =
        await readJson(response);

      if (!response.ok) {
        setNotice(
          data?.message ||
            'Could not save product.'
        );

        return;
      }

      setEditor(null);

      setNotice(
        editor.id
          ? 'Product updated successfully.'
          : 'Product created successfully.'
      );

      await loadAll(false);
    } catch (err: any) {
      console.error(
        'PRODUCT SAVE ERROR:',
        err
      );

      setNotice(
        err?.name === 'AbortError'
          ? 'Product save timed out.'
          : 'Could not save product.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(
    product: Product
  ) {
    if (
      !confirm(
        `Delete "${product.name}"?

This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response =
        await api(
          `/products/${product.id}`,
          {
            method: 'DELETE',
          }
        );

      const data =
        await readJson(response);

      if (!response.ok) {
        setNotice(
          data?.message ||
            'Delete failed.'
        );

        return;
      }

      setNotice(
        `${product.name} deleted.`
      );

      await loadAll(false);
    } catch (err: any) {
      console.error(
        'PRODUCT DELETE ERROR:',
        err
      );

      setNotice(
        'Delete failed.'
      );
    }
  }

  async function uploadMedia(
    file: File
  ) {
    const form =
      new FormData();

    form.append(
      'file',
      file
    );

    try {
      setNotice(
        'Uploading media...'
      );

      const response =
        await api(
          '/media/upload',
          {
            method: 'POST',
            body: form,
          },
          120000
        );

      const data =
        await readJson(response);

      if (!response.ok) {
        setNotice(
          data?.message ||
            'Media upload failed.'
        );

        return;
      }

      setNotice(
        'Media uploaded successfully.'
      );
    } catch (err: any) {
      console.error(
        'MEDIA UPLOAD ERROR:',
        err
      );

      setNotice(
        err?.name === 'AbortError'
          ? 'Media upload timed out.'
          : 'Media upload failed.'
      );
    }
  }

  const totalStock =
    useMemo(
      () =>
        products.reduce(
          (
            sum,
            product
          ) =>
            sum +
            (
              product.variants ||
              []
            ).reduce(
              (
                variantSum,
                variant
              ) =>
                variantSum +
                Number(
                  variant.stock
                ),
              0
            ),
          0
        ),
      [products]
    );

  if (checking) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-white/10 p-8 text-center">
          <RefreshCw
            className="animate-spin mx-auto"
            size={24}
          />

          <div className="mt-5 text-xs font-bold tracking-[0.2em]">
            CONNECTING TO DRAVON
          </div>

          <div className="mt-2 text-[10px] text-white/40 leading-relaxed">
            Checking administrator session
            and loading the backend.
          </div>

          <div className="mt-5 text-[9px] text-white/25 break-all">
            {API}
          </div>

          <button
            onClick={() =>
              loadAll(true)
            }
            className="mt-6 border border-white/20 px-5 py-3 text-[9px] tracking-[0.15em] hover:bg-white hover:text-black transition"
          >
            RETRY CONNECTION
          </button>
        </div>
      </main>
    );
  }

  if (
    !authenticated &&
    backendError
  ) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg border border-red-900/60 p-8">
          <div className="text-[9px] tracking-[0.2em] text-red-400">
            DRAVON / BACKEND ERROR
          </div>

          <h1 className="text-2xl font-black mt-3">
            API CONNECTION FAILED.
          </h1>

          <pre className="mt-6 whitespace-pre-wrap break-words bg-black border border-white/10 p-4 text-[10px] text-white/55 leading-relaxed">
            {backendError}
          </pre>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => {
                setBackendError('');
                loadAll(true);
              }}
              className="bg-[#8b0000] px-5 py-3 text-[9px] font-bold tracking-[0.16em]"
            >
              RETRY
            </button>

            <a
              href="/"
              className="border border-white/15 px-5 py-3 text-[9px] tracking-[0.16em]"
            >
              VIEW STORE
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
        <form
          onSubmit={login}
          className="w-full max-w-sm border border-white/15 p-7"
        >
          <div className="font-black tracking-[0.2em] text-xl">
            DRAVON ADMIN
          </div>

          <div className="text-[9px] tracking-[0.2em] text-white/50 mt-2">
            CONTROL THE MOVEMENT
          </div>

          <div className="mt-8">
            <label className="text-[8px] tracking-[0.16em] text-white/40">
              ADMIN EMAIL
            </label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full bg-transparent border border-white/20 p-3 text-xs mt-2 outline-none focus:border-white/50"
              placeholder="admin@dravon.in"
              type="email"
              autoComplete="username"
            />
          </div>

          <div className="mt-3">
            <label className="text-[8px] tracking-[0.16em] text-white/40">
              PASSWORD
            </label>

            <input
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full bg-transparent border border-white/20 p-3 text-xs mt-2 outline-none focus:border-white/50"
              placeholder="PASSWORD"
              type="password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8b0000] py-3 mt-5 text-[10px] tracking-[0.18em] font-bold hover:bg-[#a00000] transition"
          >
            ENTER CONTROL ROOM
          </button>

          {error && (
            <div className="mt-4 border border-red-900/50 bg-red-950/20 p-3">
              <p className="text-red-400 text-xs whitespace-pre-wrap">
                {error}
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="text-[8px] tracking-[0.15em] text-white/25">
              BACKEND
            </div>

            <div className="text-[9px] text-white/35 mt-1 break-all">
              {API}
            </div>
          </div>

          <p className="text-[9px] text-white/30 mt-6 leading-relaxed">
            Admin credentials are controlled
            by the backend environment.
            Never share the admin password
            with customers.
          </p>
        </form>
      </main>
    );
  }

  const nav: [
    AdminTab,
    string,
    any
  ][] = [
    [
      'dashboard',
      'DASHBOARD',
      LayoutDashboard,
    ],
    [
      'products',
      'PRODUCTS',
      Package,
    ],
    [
      'orders',
      'ORDERS',
      ShoppingBag,
    ],
    [
      'media',
      'MEDIA',
      ImageIcon,
    ],
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex min-h-screen">

        <aside className="w-56 border-r border-white/10 p-5 hidden md:flex md:flex-col fixed inset-y-0 left-0 bg-[#0a0a0a] z-40">
          <div className="font-black tracking-[0.2em]">
            DRAVON
          </div>

          <div className="text-[8px] tracking-[0.2em] text-white/40 mt-1">
            ADMIN CONTROL
          </div>

          <div className="mt-10 space-y-1">
            {nav.map(
              ([
                key,
                label,
                Icon,
              ]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTab(key);

                    if (
                      key ===
                      'orders'
                    ) {
                      loadOrders();
                    }
                  }}
                  className={`w-full text-left p-3 text-[9px] tracking-[0.16em] flex gap-3 items-center transition ${
                    tab === key
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              )
            )}
          </div>

          <div className="mt-auto space-y-4">
            <a
              href="/"
              className="block text-[9px] text-white/45 hover:text-white"
            >
              ← VIEW STORE
            </a>

            <button
              onClick={logout}
              className="text-[9px] flex gap-2 items-center hover:text-red-400"
            >
              <LogOut size={13} />
              LOG OUT
            </button>
          </div>
        </aside>

        <section className="flex-1 md:ml-56 p-5 md:p-8 overflow-auto">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="text-[9px] tracking-[0.2em] text-white/40">
                DRAVON / ADMIN
              </div>

              <h1 className="text-3xl md:text-5xl font-black mt-2">
                {tab.toUpperCase()}.
              </h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  loadAll(false)
                }
                className="border border-white/15 px-3 py-3 text-[9px] tracking-[0.15em] hover:bg-white hover:text-black transition"
              >
                <RefreshCw
                  size={13}
                  className="inline mr-2"
                />
                REFRESH
              </button>

              {tab ===
                'products' && (
                <button
                  onClick={
                    openNew
                  }
                  className="bg-[#8b0000] px-4 py-3 text-[9px] font-bold tracking-[0.16em] hover:bg-[#a00000]"
                >
                  <Plus
                    size={13}
                    className="inline mr-2"
                  />
                  ADD PRODUCT
                </button>
              )}
            </div>
          </div>

          {notice && (
            <div className="mt-5 border border-white/10 bg-white/[0.03] px-4 py-3 text-xs flex justify-between gap-4">
              <span>
                {notice}
              </span>

              <button
                onClick={() =>
                  setNotice('')
                }
              >
                <X size={14} />
              </button>
            </div>
          )}

          {tab ===
            'dashboard' && (
            <div className="mt-8">

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  [
                    'REVENUE',
                    `₹${Number(
                      dashboard?.revenue ||
                        0
                    ).toLocaleString(
                      'en-IN'
                    )}`,
                    IndianRupee,
                  ],

                  [
                    'ORDERS',
                    dashboard?.orders ||
                      0,
                    ShoppingBag,
                  ],

                  [
                    'PRODUCTS',
                    dashboard?.products ||
                      0,
                    Package,
                  ],

                  [
                    'LOW STOCK',
                    dashboard?.lowStock ||
                      0,
                    BarChart3,
                  ],
                ].map(
                  ([
                    label,
                    value,
                    Icon,
                  ]: any) => (
                    <div
                      key={label}
                      className="border border-white/10 p-5 bg-white/[0.03]"
                    >
                      <Icon size={16} />

                      <div className="text-[9px] tracking-[0.16em] text-white/45 mt-7">
                        {label}
                      </div>

                      <div className="text-2xl font-black mt-1">
                        {value}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 grid md:grid-cols-2 gap-3">

                <div className="border border-white/10 p-5">
                  <div className="text-[9px] tracking-[0.16em] text-white/40">
                    CURRENT CATALOG STOCK
                  </div>

                  <div className="text-3xl font-black mt-2">
                    {totalStock}
                  </div>

                  <div className="text-[10px] text-white/40 mt-1">
                    Units across all variants
                  </div>
                </div>

                <div className="border border-white/10 p-5">
                  <div className="text-[9px] tracking-[0.16em] text-white/40">
                    ADMIN URL
                  </div>

                  <div className="text-sm font-bold mt-2">
                    /admin
                  </div>

                  <div className="text-[10px] text-white/40 mt-1">
                    Bookmark this page for the client.
                  </div>
                </div>

              </div>

              <div className="mt-5 border border-white/10 p-5">
                <div className="text-[9px] tracking-[0.16em] text-white/40">
                  BACKEND STATUS
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />

                  <span className="text-xs">
                    API CONNECTED
                  </span>
                </div>

                <div className="text-[9px] text-white/30 mt-2 break-all">
                  {API}
                </div>
              </div>

            </div>
          )}

          {tab ===
            'products' && (
            <div className="mt-8">

              <div className="border border-white/10 flex max-w-xl">
                <Search
                  size={14}
                  className="m-3 text-white/40"
                />

                <input
                  value={query}
                  onChange={(e) =>
                    setQuery(
                      e.target.value
                    )
                  }
                  className="bg-transparent outline-none text-xs flex-1 py-3"
                  placeholder="SEARCH PRODUCTS..."
                />
              </div>

              <div className="mt-5 border border-white/10 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-xs">

                  <thead className="text-[8px] tracking-[0.16em] text-white/40">
                    <tr>
                      <th className="p-3">
                        PRODUCT
                      </th>

                      <th>
                        PRICE
                      </th>

                      <th>
                        STOCK
                      </th>

                      <th>
                        STATUS
                      </th>

                      <th>
                        ACTIONS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map(
                      (product) => (
                        <tr
                          className="border-t border-white/10"
                          key={
                            product.id
                          }
                        >
                          <td className="p-3">
                            <div className="font-bold">
                              {
                                product.name
                              }
                            </div>

                            <div className="text-[9px] text-white/35 mt-1">
                              {
                                product.slug
                              }
                            </div>
                          </td>

                          <td>
                            ₹
                            {Number(
                              product.price
                            ).toLocaleString(
                              'en-IN'
                            )}
                          </td>

                          <td>
                            {(
                              product.variants ||
                              []
                            ).reduce(
                              (
                                total,
                                variant
                              ) =>
                                total +
                                Number(
                                  variant.stock
                                ),
                              0
                            )}
                          </td>

                          <td>
                            <span
                              className={
                                product.published
                                  ? 'text-green-400'
                                  : 'text-white/40'
                              }
                            >
                              {product.published
                                ? 'LIVE'
                                : 'DRAFT'}
                            </span>
                          </td>

                          <td>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  openEdit(
                                    product
                                  )
                                }
                                className="border border-white/15 p-2 hover:bg-white hover:text-black"
                                title="Edit"
                              >
                                <Edit3
                                  size={13}
                                />
                              </button>

                              <button
                                onClick={() =>
                                  deleteProduct(
                                    product
                                  )
                                }
                                className="border border-red-900/60 text-red-400 p-2 hover:bg-red-900/30"
                                title="Delete"
                              >
                                <Trash2
                                  size={13}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                </table>

                {!products.length && (
                  <div className="p-10 text-center text-xs text-white/40">
                    No products found.
                  </div>
                )}
              </div>

            </div>
          )}

          {tab ===
            'orders' && (
            <div className="mt-8">

              {loadingData && (
                <div className="mb-4 text-[9px] text-white/40 tracking-[0.15em]">
                  LOADING ORDERS...
                </div>
              )}

              <div className="border border-white/10 overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-xs">

                  <thead className="text-[8px] tracking-[0.16em] text-white/40">
                    <tr>
                      <th className="p-3">
                        ORDER
                      </th>

                      <th>
                        CUSTOMER
                      </th>

                      <th>
                        TOTAL
                      </th>

                      <th>
                        STATUS
                      </th>

                      <th>
                        DATE
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map(
                      (order) => (
                        <tr
                          key={
                            order.id
                          }
                          className="border-t border-white/10"
                        >
                          <td className="p-3 font-bold">
                            {
                              order.orderNumber
                            }
                          </td>

                          <td>
                            {order.user?.email ||
                              order.address
                                ?.email ||
                              'Guest'}
                          </td>

                          <td>
                            ₹
                            {Number(
                              order.total
                            ).toLocaleString(
                              'en-IN'
                            )}
                          </td>

                          <td>
                            {order.status}
                          </td>

                          <td>
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleString(
                                  'en-IN'
                                )
                              : '-'}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                </table>

                {!orders.length && (
                  <div className="p-10 text-center text-xs text-white/40">
                    No orders yet.
                  </div>
                )}
              </div>

            </div>
          )}

          {tab ===
            'media' && (
            <div className="mt-8 space-y-5">

              <div className="border border-dashed border-white/20 p-8">

                <div className="text-xs font-bold tracking-[0.12em]">
                  MEDIA INGEST
                </div>

                <p className="text-xs text-white/45 mt-2 max-w-2xl leading-relaxed">
                  Upload product images,
                  campaign images and
                  other DRAVON media.
                  Production uploads are
                  sent to the backend and
                  should be stored in
                  Cloudinary.
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm"
                  className="mt-6 text-xs"
                  onChange={async (
                    event
                  ) => {
                    const file =
                      event.target.files?.[0];

                    if (!file) return;

                    await uploadMedia(
                      file
                    );

                    event.target.value =
                      '';
                  }}
                />

                <div className="text-[10px] text-white/35 mt-4">
                  Max 100 MB
                </div>

              </div>

              <div className="border border-white/10 p-6">

                <div className="text-[9px] tracking-[0.18em] text-white/40">
                  MEDIA STORAGE
                </div>

                <div className="mt-3 text-sm font-bold">
                  Cloudinary
                </div>

                <div className="mt-2 text-[10px] text-white/40 leading-relaxed">
                  The Cloudinary API secret
                  must remain on the backend.
                  Never expose it in the
                  Next.js frontend.
                </div>

              </div>

            </div>
          )}

        </section>
      </div>

      {editor && (
        <div className="fixed inset-0 z-[100] bg-black/80 p-4 md:p-8 overflow-y-auto">

          <form
            onSubmit={
              saveProduct
            }
            className="max-w-5xl mx-auto bg-[#101010] border border-white/15 p-5 md:p-8"
          >

            <div className="flex justify-between items-center mb-7">

              <div>
                <div className="text-[9px] tracking-[0.2em] text-white/40">
                  PRODUCT EDITOR
                </div>

                <h2 className="text-2xl font-black mt-1">
                  {editor.id
                    ? 'EDIT PRODUCT'
                    : 'NEW PRODUCT'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditor(null)
                }
              >
                <X />
              </button>

            </div>

            <div className="border-b border-white/10 pb-6">

              <div className="text-[9px] tracking-[0.18em] font-bold">
                BASIC INFORMATION
              </div>

              <div className="grid md:grid-cols-2 gap-3">

                <Field label="NAME">
                  <input
                    required
                    value={
                      editor.name
                    }
                    onChange={(e) =>
                      updateEditor(
                        'name',
                        e.target.value
                      )
                    }
                    className="input"
                    placeholder="DRAVON PERFORMANCE TEE"
                  />
                </Field>

                <Field label="SLUG">
                  <input
                    required
                    value={
                      editor.slug
                    }
                    onChange={(e) =>
                      updateEditor(
                        'slug',
                        e.target.value
                          .toLowerCase()
                          .replace(
                            /[^a-z0-9-]+/g,
                            '-'
                          )
                      )
                    }
                    className="input"
                    placeholder="performance-tee"
                  />
                </Field>

                <Field label="PRICE">
                  <input
                    required
                    type="number"
                    min="0"
                    value={
                      editor.price
                    }
                    onChange={(e) =>
                      updateEditor(
                        'price',
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="input"
                  />
                </Field>

                <Field label="MRP">
                  <input
                    type="number"
                    min="0"
                    value={
                      editor.mrp || 0
                    }
                    onChange={(e) =>
                      updateEditor(
                        'mrp',
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="input"
                  />
                </Field>

                <Field label="FABRIC">
                  <input
                    value={
                      editor.fabric ||
                      ''
                    }
                    onChange={(e) =>
                      updateEditor(
                        'fabric',
                        e.target.value
                      )
                    }
                    className="input"
                    placeholder="240 GSM COTTON"
                  />
                </Field>

                <Field label="GSM">
                  <input
                    value={
                      editor.gsm ||
                      ''
                    }
                    onChange={(e) =>
                      updateEditor(
                        'gsm',
                        e.target.value
                      )
                    }
                    className="input"
                    placeholder="240"
                  />
                </Field>

                <Field label="FIT">
                  <input
                    value={
                      editor.fit ||
                      ''
                    }
                    onChange={(e) =>
                      updateEditor(
                        'fit',
                        e.target.value
                      )
                    }
                    className="input"
                    placeholder="OVERSIZED"
                  />
                </Field>

              </div>

              <Field label="DESCRIPTION">
                <textarea
                  value={
                    editor.description ||
                    ''
                  }
                  onChange={(e) =>
                    updateEditor(
                      'description',
                      e.target.value
                    )
                  }
                  className="input min-h-28"
                  placeholder="Product description..."
                />
              </Field>

              <Field label="CARE INSTRUCTIONS">
                <textarea
                  value={
                    editor.careInstructions ||
                    ''
                  }
                  onChange={(e) =>
                    updateEditor(
                      'careInstructions',
                      e.target.value
                    )
                  }
                  className="input min-h-20"
                  placeholder="Machine wash cold..."
                />
              </Field>

              <div className="flex flex-wrap gap-5 mt-5 text-[10px] tracking-[0.12em]">

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      !!editor.published
                    }
                    onChange={(e) =>
                      updateEditor(
                        'published',
                        e.target.checked
                      )
                    }
                  />
                  PUBLISHED / LIVE
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      !!editor.featured
                    }
                    onChange={(e) =>
                      updateEditor(
                        'featured',
                        e.target.checked
                      )
                    }
                  />
                  FEATURED
                </label>

              </div>

            </div>

            <div className="mt-8 border-b border-white/10 pb-6">

              <div className="text-[9px] tracking-[0.18em] font-bold">
                SEO
              </div>

              <Field label="SEO TITLE">
                <input
                  value={
                    editor.seoTitle ||
                    ''
                  }
                  onChange={(e) =>
                    updateEditor(
                      'seoTitle',
                      e.target.value
                    )
                  }
                  className="input"
                  placeholder="DRAVON PERFORMANCE TEE | CALISTHENICS WEAR"
                />
              </Field>

              <Field label="SEO DESCRIPTION">
                <textarea
                  value={
                    editor.seoDescription ||
                    ''
                  }
                  onChange={(e) =>
                    updateEditor(
                      'seoDescription',
                      e.target.value
                    )
                  }
                  className="input min-h-20"
                  placeholder="SEO meta description..."
                />
              </Field>

            </div>

            <div className="mt-8 border-b border-white/10 pb-6">

              <div className="flex justify-between items-center">

                <div>
                  <div className="text-[9px] tracking-[0.18em] font-bold">
                    PRODUCT IMAGES
                  </div>

                  <div className="text-[9px] text-white/35 mt-1">
                    Use Cloudinary URLs for
                    production product images.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditor({
                      ...editor,
                      images: [
                        ...(editor.images ||
                          []),
                        {
                          url: '',
                          altText: '',
                          type: 'image',
                        },
                      ],
                    })
                  }
                  className="text-[9px] border border-white/15 px-3 py-2"
                >
                  <Plus
                    size={12}
                    className="inline mr-1"
                  />
                  ADD IMAGE
                </button>

              </div>

              <div className="mt-3 space-y-3">

                {(editor.images ||
                  []
                ).map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-[1fr_1fr_auto] gap-2"
                    >

                      <input
                        value={
                          image.url
                        }
                        onChange={(
                          e
                        ) => {
                          const images =
                            [
                              ...(editor.images ||
                                []),
                            ];

                          images[
                            index
                          ] = {
                            ...images[
                              index
                            ],
                            url:
                              e.target
                                .value,
                          };

                          setEditor({
                            ...editor,
                            images,
                          });
                        }}
                        className="input"
                        placeholder="https://res.cloudinary.com/..."
                      />

                      <input
                        value={
                          image.altText ||
                          ''
                        }
                        onChange={(
                          e
                        ) => {
                          const images =
                            [
                              ...(editor.images ||
                                []),
                            ];

                          images[
                            index
                          ] = {
                            ...images[
                              index
                            ],
                            altText:
                              e.target
                                .value,
                          };

                          setEditor({
                            ...editor,
                            images,
                          });
                        }}
                        className="input"
                        placeholder="ALT TEXT"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setEditor({
                            ...editor,
                            images:
                              (
                                editor.images ||
                                []
                              ).filter(
                                (
                                  _,
                                  i
                                ) =>
                                  i !==
                                  index
                              ),
                          })
                        }
                        className="border border-red-900 text-red-400 px-3"
                      >
                        <Trash2
                          size={13}
                        />
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>

            <div className="mt-8 border-b border-white/10 pb-6">

              <div className="flex justify-between items-center">

                <div>
                  <div className="text-[9px] tracking-[0.18em] font-bold">
                    VARIANTS & STOCK
                  </div>

                  <div className="text-[9px] text-white/35 mt-1">
                    Each size/color combination
                    has its own SKU and stock.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditor({
                      ...editor,
                      variants: [
                        ...(editor.variants ||
                          []),
                        {
                          sku: `DRV-${Date.now()}`,
                          color: 'Black',
                          size: 'M',
                          stock: 0,
                        },
                      ],
                    })
                  }
                  className="text-[9px] border border-white/15 px-3 py-2"
                >
                  <Plus
                    size={12}
                    className="inline mr-1"
                  />
                  ADD VARIANT
                </button>

              </div>

              <div className="mt-3 space-y-2">

                {(
                  editor.variants ||
                  []
                ).map(
                  (
                    variant,
                    index
                  ) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_100px_auto] gap-2"
                    >

                      <input
                        value={
                          variant.sku
                        }
                        onChange={(
                          e
                        ) => {
                          const variants =
                            [
                              ...(editor.variants ||
                                []),
                            ];

                          variants[
                            index
                          ] = {
                            ...variants[
                              index
                            ],
                            sku:
                              e.target
                                .value,
                          };

                          setEditor({
                            ...editor,
                            variants,
                          });
                        }}
                        className="input"
                        placeholder="SKU"
                      />

                      <input
                        value={
                          variant.color
                        }
                        onChange={(
                          e
                        ) => {
                          const variants =
                            [
                              ...(editor.variants ||
                                []),
                            ];

                          variants[
                            index
                          ] = {
                            ...variants[
                              index
                            ],
                            color:
                              e.target
                                .value,
                          };

                          setEditor({
                            ...editor,
                            variants,
                          });
                        }}
                        className="input"
                        placeholder="COLOR"
                      />

                      <input
                        value={
                          variant.size
                        }
                        onChange={(
                          e
                        ) => {
                          const variants =
                            [
                              ...(editor.variants ||
                                []),
                            ];

                          variants[
                            index
                          ] = {
                            ...variants[
                              index
                            ],
                            size:
                              e.target
                                .value,
                          };

                          setEditor({
                            ...editor,
                            variants,
                          });
                        }}
                        className="input"
                        placeholder="SIZE"
                      />

                      <input
                        type="number"
                        min="0"
                        value={
                          variant.stock
                        }
                        onChange={(
                          e
                        ) => {
                          const variants =
                            [
                              ...(editor.variants ||
                                []),
                            ];

                          variants[
                            index
                          ] = {
                            ...variants[
                              index
                            ],
                            stock:
                              Number(
                                e.target
                                  .value
                              ),
                          };

                          setEditor({
                            ...editor,
                            variants,
                          });
                        }}
                        className="input"
                        placeholder="STOCK"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setEditor({
                            ...editor,
                            variants:
                              (
                                editor.variants ||
                                []
                              ).filter(
                                (
                                  _,
                                  i
                                ) =>
                                  i !==
                                  index
                              ),
                          })
                        }
                        className="border border-red-900 text-red-400 px-3"
                      >
                        <Trash2
                          size={13}
                        />
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>

            <div className="flex justify-end gap-2 mt-8">

              <button
                type="button"
                onClick={() =>
                  setEditor(null)
                }
                className="border border-white/15 px-5 py-3 text-[9px] tracking-[0.16em]"
              >
                CANCEL
              </button>

              <button
                disabled={saving}
                className="bg-[#8b0000] px-6 py-3 text-[9px] font-bold tracking-[0.16em] disabled:opacity-50"
              >
                {saving
                  ? 'SAVING...'
                  : editor.id
                  ? 'SAVE CHANGES'
                  : 'CREATE PRODUCT'}
              </button>

            </div>

          </form>
        </div>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.14);
          padding: 0.75rem;
          font-size: 0.75rem;
          outline: none;
          color: white;
        }

        .input:focus {
          border-color: rgba(255, 255, 255, 0.5);
        }

        .input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        label {
          display: block;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mt-4">
      <span className="text-[8px] tracking-[0.16em] text-white/40 block mb-2">
        {label}
      </span>

      {children}
    </label>
  );
}