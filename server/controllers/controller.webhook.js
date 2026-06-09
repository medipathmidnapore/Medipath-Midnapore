import Test from '../models/model.test.js';

/**
 * POST /api/webhook/lab-sync
 * Accepts test list from the hospital LIS and bulk-upserts into MongoDB cache.
 * Protected by x-webhook-secret header (middleware.webhook.js).
 *
 * Expected payload:
 * {
 *   tests: [{ name, code, price, category, description, turnaroundHours }]
 * }
 */
export const syncTests = async (req, res) => {
  try {
    const { tests } = req.body;

    if (!tests || !Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload. Expected { tests: [...] }',
      });
    }

    const operations = tests.map((test) => ({
      updateOne: {
        filter: { name: test.name },
        update: {
          $set: {
            name: test.name,
            code: test.code || '',
            price: Number(test.price),
            category: test.category || 'General',
            description: test.description || '',
            turnaroundHours: test.turnaroundHours || 24,
            isActive: true,
            lastSyncedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await Test.bulkWrite(operations);

    console.log(`[Webhook] Lab sync: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`);

    res.status(200).json({
      success: true,
      message: 'Test cache synchronized successfully.',
      synced: tests.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (error) {
    console.error('syncTests error:', error);
    res.status(500).json({ success: false, message: 'Webhook sync failed.' });
  }
};
