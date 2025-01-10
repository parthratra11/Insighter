import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
from faker import Faker
import uuid

def main():
    # Initialize
    fake = Faker()
    np.random.seed(42)
    random.seed(42)
    
    # Constants
    NUM_POSTS = 1000
    BASE_DATE = datetime(2024, 1, 1)
    
    # Define categories and options
    GENRES = ['fashion', 'food', 'travel', 'tech', 'lifestyle', 'fitness', 'beauty', 'gaming']
    POST_TYPES = ['image', 'video', 'carousel', 'reel']
    HASHTAGS = {
        'fashion': ['#ootd', '#style', '#fashion', '#trendy', '#fashionista'],
        'food': ['#foodie', '#cooking', '#recipe', '#tasty', '#foodporn'],
        'travel': ['#wanderlust', '#travel', '#explore', '#adventure', '#travelgram'],
        'tech': ['#tech', '#gadgets', '#innovation', '#coding', '#ai'],
        'lifestyle': ['#lifestyle', '#life', '#inspiration', '#motivation', '#mindfulness'],
        'fitness': ['#fitness', '#workout', '#gym', '#health', '#wellness'],
        'beauty': ['#beauty', '#skincare', '#makeup', '#glam', '#selfcare'],
        'gaming': ['#gaming', '#gamer', '#esports', '#streamer', '#gameplay']
    }
    AGE_GROUPS = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-90']
    GENDERS = ['male', 'female', 'other']
    REGIONS = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania']
    DEVICES = ['mobile', 'desktop', 'tablet']
    
    print("Generating social media analytics dataset...")
    
    posts = []
    for _ in range(NUM_POSTS):
        # Basic post info
        genre = random.choice(GENRES)
        post_date = BASE_DATE + timedelta(
            days=random.randint(0, 90),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        # Generate engagement metrics
        base_engagement = random.randint(1000, 10000)
        likes = int(base_engagement * random.uniform(0.4, 0.8))
        comments = int(base_engagement * random.uniform(0.05, 0.2))
        shares = int(base_engagement * random.uniform(0.02, 0.1))
        saves = int(base_engagement * random.uniform(0.01, 0.05))
        
        # Generate sentiment distributions
        sentiment_total = likes + comments
        positive_pct = random.uniform(0.4, 0.8)
        negative_pct = random.uniform(0.05, 0.2)
        neutral_pct = 1 - (positive_pct + negative_pct)
        
        # Generate user demographics
        age_distribution = {group: random.uniform(0, 1) for group in AGE_GROUPS}
        total = sum(age_distribution.values())
        age_distribution = {k: round(v/total * 100, 1) for k, v in age_distribution.items()}
        
        gender_distribution = {gender: random.uniform(0, 1) for gender in GENDERS}
        total = sum(gender_distribution.values())
        gender_distribution = {k: round(v/total * 100, 1) for k, v in gender_distribution.items()}
        
        region_distribution = {region: random.uniform(0, 1) for region in REGIONS}
        total = sum(region_distribution.values())
        region_distribution = {k: round(v/total * 100, 1) for k, v in region_distribution.items()}
        
        # Select and track hashtags
        num_hashtags = random.randint(3, 8)
        selected_hashtags = random.sample(HASHTAGS[genre] + random.sample([tag for tags in HASHTAGS.values() for tag in tags], 10), num_hashtags)
        hashtag_performance = {tag: random.randint(50, 100) for tag in selected_hashtags}
        
        # Device distribution
        device_distribution = {device: random.uniform(0, 1) for device in DEVICES}
        total = sum(device_distribution.values())
        device_distribution = {k: round(v/total * 100, 1) for k, v in device_distribution.items()}
        
        # Compile post data
        post_data = {
            'post_id': str(uuid.uuid4()),
            'posted_at': post_date,
            'genre': genre,
            'post_type': random.choice(POST_TYPES),
            'hashtags': ', '.join(selected_hashtags),
            'hashtag_reach_score': sum(hashtag_performance.values()),
            
            # Engagement metrics
            'total_engagements': base_engagement,
            'likes': likes,
            'comments': comments,
            'shares': shares,
            'saves': saves,
            'engagement_rate': round((likes + comments + shares + saves) / base_engagement * 100, 2),
            
            # Sentiment analysis
            'positive_sentiment_pct': round(positive_pct * 100, 1),
            'neutral_sentiment_pct': round(neutral_pct * 100, 1),
            'negative_sentiment_pct': round(negative_pct * 100, 1),
            
            # Demographics - Age
            **{f'age_{age.replace("-", "_")}_pct': pct 
               for age, pct in age_distribution.items()},
            
            # Demographics - Gender
            **{f'{gender}_pct': pct 
               for gender, pct in gender_distribution.items()},
            
            # Demographics - Region
            **{f'region_{region.lower().replace(" ", "_")}_pct': pct 
               for region, pct in region_distribution.items()},
            
            # Device distribution
            **{f'device_{device}_pct': pct 
               for device, pct in device_distribution.items()},
            
            # Time metrics
            'avg_view_duration': random.randint(5, 300),
            'completion_rate': random.uniform(0.3, 0.9)
        }
        
        posts.append(post_data)
    
    # Convert to DataFrame and save
    df = pd.DataFrame(posts)
    
    # Reorder columns for better readability
    column_order = [
        'post_id', 'posted_at', 'genre', 'post_type', 'hashtags', 'hashtag_reach_score',
        'total_engagements', 'likes', 'comments', 'shares', 'saves', 'engagement_rate',
        'positive_sentiment_pct', 'neutral_sentiment_pct', 'negative_sentiment_pct',
        'avg_view_duration', 'completion_rate'
    ] + [col for col in df.columns if col.startswith(('age_', 'gender_', 'region_', 'device_'))]
    
    df = df[column_order]
    
    # Save to CSV
    output_file = 'social_media_analytics.csv'
    df.to_csv(output_file, index=False)
    
    # Print summary
    print("\nDataset generation complete!")
    print(f"File saved as: {output_file}")
    print(f"Total records: {len(df)}")
    print("\nColumns in dataset:")
    for col in df.columns:
        print(f"- {col}")

if __name__ == "__main__":
    main()