import Notice from '../models/model.notice.js';

// Public: Get all active notices
export const getActiveNotices = async (req, res) => {
  try {
    const now = new Date();
    // Active notices: isActive=true AND publishAt <= now AND (isPermanent=true OR expiresAt > now)
    const notices = await Notice.find({
      isActive: true,
      publishAt: { $lte: now },
      $or: [
        { isPermanent: true },
        { expiresAt: { $gt: now } }
      ]
    }).sort({ createdAt: -1 });

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all notices (including expired/inactive)
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create notice
export const createNotice = async (req, res) => {
  try {
    const { title, content, type, publishAt, durationType, customHours } = req.body;
    let expiresAt = null;
    let isPermanent = false;
    
    const publishDate = publishAt ? new Date(publishAt) : new Date();

    if (durationType === 'forever') {
      isPermanent = true;
    } else {
      let hoursToAdd = 0;

      if (durationType === '1_day') hoursToAdd = 24;
      else if (durationType === '1_week') hoursToAdd = 24 * 7;
      else if (durationType === 'custom' && customHours) hoursToAdd = Number(customHours);

      if (hoursToAdd > 0) {
        expiresAt = new Date(publishDate.getTime() + hoursToAdd * 60 * 60 * 1000);
      } else {
        return res.status(400).json({ success: false, message: 'Invalid duration specified' });
      }
    }

    const notice = await Notice.create({
      title,
      content,
      type: type || 'nominal',
      publishAt: publishDate,
      isPermanent,
      expiresAt,
      isActive: true
    });

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete notice
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Toggle notice active status
export const toggleNoticeStatus = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    
    notice.isActive = !notice.isActive;
    await notice.save();

    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
