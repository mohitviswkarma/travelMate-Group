package com.travelmate.repository.chat;

import com.travelmate.entity.Message;
import com.travelmate.config.HibernateConfig;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;
import java.util.UUID;

public class MessageDAO {

    // ==========================
    // SAVE MESSAGE
    // ==========================
    public void saveMessage(Message message) {
        Transaction tx = null;
        try (Session session = HibernateConfig.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            session.save(message);
            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            e.printStackTrace();
        }
    }

    // ==========================
    // FETCH CHAT HISTORY (LATEST FIRST + PAGINATION)
    // ==========================
    public List<Message> getConversationMessages(
            String conversationId,
            int offset,
            int limit
    ) {
        try (Session session = HibernateConfig.getSessionFactory().openSession()) {
            return session.createQuery(
                    "FROM Message m WHERE m.conversationId = :cid ORDER BY m.createdAt DESC",
                    Message.class
            )
            .setParameter("cid", conversationId)
            .setFirstResult(offset)
            .setMaxResults(limit)
            .list();
        }
    }

    // ==========================
    // FETCH LAST N MESSAGES
    // ==========================
    public List<Message> getLastMessages(String conversationId, int limit) {
        try (Session session = HibernateConfig.getSessionFactory().openSession()) {
            return session.createQuery(
                    "FROM Message m WHERE m.conversationId = :cid ORDER BY m.createdAt DESC",
                    Message.class
            )
            .setParameter("cid", conversationId)
            .setMaxResults(limit)
            .list();
        }
    }

    // ==========================
    // FETCH UNREAD MESSAGES
    // ==========================
    public List<Message> getUnreadMessages(UUID receiverId) {
        try (Session session = HibernateConfig.getSessionFactory().openSession()) {
            return session.createQuery(
                    "FROM Message m WHERE m.receiverId = :rid AND m.read = false ORDER BY m.createdAt ASC",
                    Message.class
            )
            .setParameter("rid", receiverId)
            .list();
        }
    }

    // ==========================
    // MARK MESSAGES AS READ
    // ==========================
    public void markConversationAsRead(String conversationId, UUID receiverId) {
        Transaction tx = null;
        try (Session session = HibernateConfig.getSessionFactory().openSession()) {
            tx = session.beginTransaction();

            session.createQuery(
                    "UPDATE Message m SET m.read = true WHERE m.conversationId = :cid AND m.receiverId = :rid"
            )
            .setParameter("cid", conversationId)
            .setParameter("rid", receiverId)
            .executeUpdate();

            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            e.printStackTrace();
        }
    }

    // ==========================
    // COUNT UNREAD MESSAGES
    // ==========================
    public long countUnread(UUID receiverId) {
        try (Session session = HibernateConfig.getSessionFactory().openSession()) {
            return session.createQuery(
                    "SELECT COUNT(m) FROM Message m WHERE m.receiverId = :rid AND m.read = false",
                    Long.class
            )
            .setParameter("rid", receiverId)
            .uniqueResult();
        }
    }
}
