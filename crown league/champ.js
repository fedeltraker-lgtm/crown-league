// netlify/functions/champ.js
import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    const store = getStore('champs');

    // GET - جلب البطولات
    if (event.httpMethod === 'GET') {
        const data = await store.get('all', { type: 'json' });
        return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    // POST - إضافة بطولة
    if (event.httpMethod === 'POST') {
        const newItem = JSON.parse(event.body);
        let items = await store.get('all', { type: 'json' }) || [];
        items.push(newItem);
        await store.set('all', JSON.stringify(items));
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    // DELETE - حذف بطولة
    if (event.httpMethod === 'DELETE') {
        const { id } = JSON.parse(event.body);
        let items = await store.get('all', { type: 'json' }) || [];
        items = items.filter(i => i.id !== id);
        await store.set('all', JSON.stringify(items));
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };
};