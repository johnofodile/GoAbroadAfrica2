import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getExperience, likeExperience, addComment } from '../services/experienceService';


export default function ExperienceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [experience, setExperience]   = useState(null);
  const [comments, setComments]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [liked, setLiked]             = useState(false);
  const [likesCount, setLikesCount]   = useState(0);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting]         = useState(false);

    useEffect(() => {
    const fetchExperience = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getExperience(id);
        setExperience(res.data.experience);
        setComments(res.data.comments);
        setLiked(res.data.experience.likes?.includes(user?.id));
        setLikesCount(res.data.experience.likes?.length || 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load experience');
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id, user]);

  const handleLike = async () => {
    try {
      const res = await likeExperience(id);
      setLiked(res.data.liked);
      setLikesCount(res.data.likes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like');
    }
  };

    const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      const res = await addComment(id, { content: commentText });
      setComments(prev => [res.data.comment, ...prev]);
      setCommentText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };
  if (loading) return <div className='page-container'>Loading...</div>;
  if (error)   return <div className='page-container text-red-600'>{error}</div>;
  if (!experience) return null;
   return (
    <div className='page-container max-w-3xl mx-auto'>
      <div className='card p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <img src={experience.userId?.avatar || '/default-avatar.png'}
            className='w-10 h-10 rounded-full object-cover' alt='' />
          <div>
            <p className='font-semibold text-gray-800'>{experience.userId?.name}</p>
            <p className='text-xs text-gray-400'>{experience.userId?.country}</p>
          </div>
        </div>
        <h1 className='text-2xl font-bold text-primary mb-2'>{experience.title}</h1>
        <p className='text-sm text-gray-500 mb-4'>
          {experience.country} {experience.city && `• ${experience.city}`} • {experience.category?.replace('-', ' ')} • {experience.views} views
        </p>

        {experience.images?.length > 0 && (
          <div className='grid grid-cols-2 gap-2 mb-4'>
            {experience.images.map((img, i) => (
              <img key={i} src={img} alt={`${experience.title} ${i + 1}`}
                className='w-full h-48 object-cover rounded-lg' />
            ))}
          </div>
        )}

        <p className='text-gray-700 whitespace-pre-line mb-4'>{experience.content}</p>

        {experience.tags?.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {experience.tags.map(tag => (
              <span key={tag} className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>#{tag}</span>
            ))}
          </div>
        )}

        {user ? (
          <button onClick={handleLike}
            className={`text-sm font-medium ${liked ? 'text-red-500' : 'text-gray-400'}`}>
            {liked ? '❤️' : '🤍'} {likesCount} likes
          </button>
        ) : (
          <p className='text-sm text-gray-400'>🤍 {likesCount} likes</p>
        )}
      </div>

      <div className='card p-6 mt-6'>
        <h2 className='text-lg font-bold text-primary mb-4'>Comments ({comments.length})</h2>

        {user && (
          <form onSubmit={handleCommentSubmit} className='flex gap-2 mb-6'>
            <input className='input' placeholder='Add a comment...'
              value={commentText} onChange={e => setCommentText(e.target.value)} />
            <button type='submit' disabled={posting} className='btn-primary whitespace-nowrap'>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </form>
        )}

        <div className='space-y-4'>
          {comments.map(c => (
            <div key={c._id} className='flex gap-3'>
              <img src={c.userId?.avatar || '/default-avatar.png'}
                className='w-8 h-8 rounded-full object-cover' alt='' />
              <div>
                <p className='text-sm font-semibold text-gray-800'>{c.userId?.name}</p>
                <p className='text-sm text-gray-600'>{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


