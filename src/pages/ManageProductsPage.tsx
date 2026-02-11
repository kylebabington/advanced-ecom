// src/pages/ManageProductsPage.tsx
// Basic Firestore CRUD UI for products.
// Product images can be uploaded to Firebase Storage via drag-and-drop or file picker.

import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Product } from '../api/types'
import {
    createProduct,
    deleteProduct,
    fetchAllProducts,
    updateProduct,
    validateProductInput,
    type ProductInput,
} from '../firebase/products'
import { uploadProductImage } from '../firebase/storage'
import ImageWithFallback from '../components/ImageWithFallback'
import { useToast } from '../components/Toast'
import { useAuth } from '../auth/AuthContext'
import { Link } from 'react-router-dom'

const emptyForm: ProductInput = {
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
}

export default function ManageProductsPage() {
    const qc = useQueryClient()
    const { showToast } = useToast()
    const { user, loading: authLoading, isAdmin, adminChecked } = useAuth()

    const { data, isLoading, isError, error } = useQuery<Product[]>({
        queryKey: ['products-admin'],
        queryFn: fetchAllProducts,
        enabled: !!user && isAdmin,
    })

    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<ProductInput>(emptyForm)
    const [busy, setBusy] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [formErrors, setFormErrors] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editingProduct = useMemo(
        () => data?.find((p) => p.id === editingId) ?? null,
        [data, editingId]
    )

    useEffect(() => {
        if (editingProduct) {
            setForm({
                title: editingProduct.title,
                price: editingProduct.price,
                description: editingProduct.description,
                category: editingProduct.category,
                image: editingProduct.image,
            })
        } else {
            setForm(emptyForm)
        }
    }, [editingProduct])

    const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    async function handleImageFile(file: File) {
        setUploadError(null)
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setUploadError('Please use a JPEG, PNG, GIF, or WebP image.')
            return
        }
        setUploading(true)
        try {
            const url = await uploadProductImage(file)
            setForm((f) => ({ ...f, image: url }))
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Upload failed')
        } finally {
            setUploading(false)
        }
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleImageFile(file)
    }

    if (authLoading || (user && !adminChecked)) return <div className="page">Loading...</div>
    if (!user || !isAdmin) {
        return (
            <div className="page">
                <h2 className="pageTitle">Manage Products</h2>
                <div className="notice">Access denied. Only admins can manage products.</div>
                <Link to="/" className="btn" style={{ marginTop: 12, display: 'inline-block' }}>Back to Home</Link>
            </div>
        )
    }

    return (
    <div className="page">
        <h2 className="pageTitle">Manage Products</h2>

        {isLoading && <div>Loading...</div>}
        {isError && <div className="notice">{(error as Error)?.message ?? 'Error'}</div>}

        <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit product' : 'Create product'}</h3>

            <div style={{ display: 'grid', gap: 10 }}>
                {formErrors.length > 0 && (
                    <div className="notice" role="alert">
                        {formErrors.map((e, i) => (
                            <div key={i}>{e}</div>
                        ))}
                    </div>
                )}
                <label className="muted small">Title</label>
                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
                <label className="muted small">Description</label>
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                <label className="muted small">Price</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price === 0 ? '' : form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                />
                <label className="muted small">Category</label>
                <input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                />
                <label className="muted small">Product image</label>
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: `2px dashed ${isDragOver ? 'var(--color-primary, #646cff)' : '#ccc'}`,
                        borderRadius: 8,
                        padding: 24,
                        textAlign: 'center',
                        cursor: uploading ? 'wait' : 'pointer',
                        backgroundColor: isDragOver ? 'rgba(100, 108, 255, 0.08)' : undefined,
                        opacity: uploading ? 0.7 : 1,
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="sr-only"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageFile(file)
                            e.target.value = ''
                        }}
                    />
                    {uploading ? (
                        <span className="muted">Uploading…</span>
                    ) : (
                        <span className="muted">Drop an image here or click to browse</span>
                    )}
                </div>
                {uploadError && <div className="notice" style={{ marginTop: 8 }}>{uploadError}</div>}
                {form.image && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                            <ImageWithFallback
                                src={form.image}
                                alt="Preview"
                                className="manage-product-preview-img"
                            />
                        </div>
                        <div className="muted small" style={{ flex: 1 }}>
                            Image set. You can drop a new one to replace, or paste a URL below.
                        </div>
                    </div>
                )}
                <label className="muted small">Or paste image URL</label>
                <input
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                />

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                        className="btn btnPrimary"
                        disabled={busy}
                        onClick={async () => {
                            setFormErrors([])
                            const errors = editingId
                                ? validateProductInput(form, true)
                                : validateProductInput(form, false)
                            if (errors.length) {
                                setFormErrors(errors)
                                return
                            }
                            setBusy(true)
                            try {
                                if (editingId) await updateProduct(editingId, form)
                                else await createProduct(form)

                                setEditingId(null)
                                setFormErrors([])
                                await qc.invalidateQueries({ queryKey: ['products-admin'] })
                                await qc.invalidateQueries({ queryKey: ['products'] })
                                showToast(editingId ? 'Product updated successfully' : 'Product created successfully')
                            } catch (err) {
                                setFormErrors([err instanceof Error ? err.message : 'Failed to save product'])
                            } finally {
                                setBusy(false)
                            }
                        }}
                    >
                        {busy ? 'Saving...' : editingId ? 'Save changes' : 'Create product'}
                    </button>

                    {editingId && (
                        <button
                            className="btn"
                            disabled={busy}
                            onClick={() => setEditingId(null)}
                        >
                            Cancel edit
                        </button>
                    )}
                </div>
            </div>
        </div>

        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            {data?.map((p) => (
                <div key={p.id} className="card" style={{ padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>{p.title}</div>
                            <div className="muted small">
                                ${p.price.toFixed(2)} - {p.category}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn" onClick={() => setEditingId(p.id)}>
                                Edit
                            </button>
                            <button
                                className="btn"
                                onClick={async () => {
                                    await deleteProduct(p.id)
                                    await qc.invalidateQueries({ queryKey: ['products-admin'] })
                                    await qc.invalidateQueries({ queryKey: ['products'] })
                                    showToast('Product deleted successfully')
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    )
}