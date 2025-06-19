from flask import Flask, render_template

app = Flask(__name__)

# List of 10 avatars (update image names to match your files in static/images/)
avatars = [
    {
        'name': 'Matsya (The Fish)',
        'image': 'Matsya.png',
        'bg_image': 'matsya-bg.png',
        'desc': 'The fish avatar who saved Manu from the great flood.',
        'brief': 'When the world was threatened by a great deluge, Vishnu took the form of Matsya to guide the sage Manu and all creatures to safety. Matsya represents the power of guidance through chaos and darkness. He teaches us the value of preparation and foresight in the face of adversity. By saving sacred scriptures and living beings, Matsya symbolizes the preservation of wisdom and life itself. This avatar encourages us to be resourceful and calm during turbulent times. Matsya shows that help arrives when we remain righteous and steadfast. He motivates us to embrace change and swim through uncertainties with faith. This story reminds us that every end is a new beginning. With humility and perseverance, we can overcome even the greatest floods of life. The Matsya avatar inspires us to be saviors and guides for others in times of crisis.'
    },
    {
        'name': 'Kurma (The Tortoise)',
        'image': 'Kurma.png',
        'bg_image': 'kurma-bg.png',
        'desc': 'The tortoise avatar who supported Mount Mandara during Samudra Manthan.',
        'brief': 'As the gods and demons churned the ocean for nectar, the mountain began to sink, and Vishnu became Kurma to support it on his back. Kurma teaches us the importance of stability and support during monumental tasks. He reminds us that a strong foundation is essential for any great achievement. Through patience and endurance, Kurma enables the impossible to become possible. His role signifies the power of silent strength and perseverance. Kurma motivates us to carry burdens with grace for the greater good.He encourages teamwork, as both gods and demons had to cooperate. The avatar teaches us that every challenge brings valuable rewards. By staying grounded, we can uplift the world around us. Kurmas lesson: Be steady and reliable, and success will follow.'
    },
    {
        'name': 'Varaha (The Boar)',
        'image': 'Varaha.png',
        'bg_image': 'varaha-bg.png',
        'desc': 'The boar avatar who lifted the earth out of cosmic waters.',
        'brief': 'When the earth was submerged by a demon, Vishnu incarnated as Varaha and lifted the planet on his tusks. Varaha symbolizes the triumph of good over evil and the power to restore balance. He teaches us that even the mightiest obstacles can be overcome with courage. Varahas dive into darkness shows the importance of facing fears head-on. This avatar motivates us to stand up against injustice and protect the vulnerable. He exemplifies selfless action for the benefit of the world. Varaha inspires us to use our strength to uplift others. His story is a reminder that resilience brings light back into the world. With unwavering determination, we can rescue hope from the depths. Varaha teaches us to be fearless saviors and restorers of harmony.'
    },
    {
        'name': 'Narasimha (The Man-Lion)',
        'image': 'Narasimha.png',
        'bg_image': 'narasimha-bg.png',
        'desc': 'The man-lion avatar who killed demon Hiranyakashipu.',
        'brief': 'To end the tyranny of Hiranyakashipu and protect his devotee Prahlada, Vishnu appeared as Narasimha—half-man, half-lion. Narasimha shows us that divine help transcends logic and limitations. He teaches the power of faith and the ultimate victory of truth. By overcoming the indestructible demon, Narasimha proves justice always prevails. His fierce form reminds us that patience has limits, and evil must be confronted. Narasimha motivates us to stand up for righteousness, no matter the odds. He exemplifies the courage to defend the innocent and stand against oppression. This avatar shows that compassion and strength can coexist. Narasimha teaches us not to fear adversity when standing for truth. His story is a timeless reminder that faith and courage can defeat any force.'
    },
    {
        'name': 'Vamana (The Dwarf Sage)',
        'image': 'Vamana.png',
        'bg_image': 'vamana-bg.png',
        'desc': 'The dwarf avatar who subdued the king Bali.',
        'brief': 'Vishnu incarnated as Vamana to humble the demon king Bali, who became arrogant with power. With a simple request for three paces of land, Vamana transformed the world. He teaches that humility and wisdom can overcome pride and ego. Vamana’s story is a lesson in using intelligence over force. He motivates us to speak the truth and keep our promises. Vamana inspires us to recognize the value of contentment and gratitude. He shows that small steps, if righteous, lead to big transformations. The avatar reminds us to use our gifts for the greater good. Vamana teaches that even the mighty must respect dharma and humility. His story encourages us to act with purpose and humility in all endeavors.'
    },
    {
        'name': 'Parashurama (The Warrior Sage)',
        'image': 'Parashurama.png',
        'bg_image': 'parashurama-bg.png',
        'desc': 'The warrior-sage who wielded an axe.',
        'brief': 'When the warrior class became tyrannical, Vishnu incarnated as Parashurama, wielding an axe to restore balance. Parashurama represents righteous anger and the need for action against injustice. He teaches us that courage must be tempered with wisdom. Parashurama motivates us to stand up for what is right, even against great odds. His life exemplifies discipline, self-control, and dedication to duty. He inspires us to use our strengths for the protection of the innocent. Parashurama shows that true warriors fight not out of hate, but to uphold justice. He reminds us that self-mastery is the key to real strength. The avatar’s story encourages humility, even in the face of victory. Parashuramas journey teaches that real heroes serve a higher purpose.'
    },
    {
        'name': 'Sri Rama (The Ideal King)',
        'image': 'Sri_Rama.png',
        'bg_image': 'sri_rama-bg.png',
        'desc': 'The prince of Ayodhya, hero of the Ramayana.',
        'brief': 'As Rama, Vishnu lived a life of truth, duty, and compassion—becoming the ideal son, husband, and king. Ramas journey is a lesson in sacrifice for the greater good. He teaches us the value of honor, integrity, and keeping one’s word. Rama motivates us to uphold righteousness, even in adversity. His story shows that leadership is rooted in service and compassion. He inspires us to be just, loving, and respectful in relationships. Rama’s devotion to family and subjects makes him a timeless role model. He reminds us that virtue is more important than victory. The avatar teaches the power of forgiveness and empathy. Rama’s life motivates us to pursue excellence with humility and love.'
    },
    {
        'name': 'Sri Krishna (The Divine Guide)',
        'image': 'Sri_Krishna.png',
        'bg_image': 'sri_krishna-bg.png',
        'desc': 'The divine cowherd, philosopher, and kingmaker.',
        'brief': 'Vishnu incarnated as Krishna to guide humanity in times of moral crisis. Krishnas wisdom in the Bhagavad Gita teaches us to act without attachment to results. He motivates us to embrace duty, selflessness, and spiritual growth. Krishnas playful nature reminds us to find joy in every moment. He teaches us to stand up for truth with courage and intelligence. Krishna inspires us to nurture loving relationships and friendship. His life is a lesson in balancing action with compassion and wisdom. Krishnas guidance empowers us to overcome doubts and fears. He shows that divine love and knowledge can transform the world. Krishna motivates us to live with purpose, joy, and resilience.'
    },
    {
        'name': 'Sri Venkateswara (Lord of 7 Hills)',
        'image': 'Sri_Venkateswara.png',
        'bg_image': 'sri_venkateswara-bg.png',
        'desc': 'Sri Venkateswara, Lord of Prosperity, grants peace and blessings.',
        'brief': 'As Venkateswara, Vishnu descended to bless humanity with hope, prosperity, and spiritual fulfillment. He teaches the importance of faith and surrender to the divine will. Venkateswara inspires us to be patient and trust the timing of the universe. His presence uplifts us to seek peace, harmony, and self-realization. The avatar is a symbol of generosity, compassion, and endless grace. He motivates us to help others and share our blessings. Venkateswaras story encourages humility and selfless service. He reminds us that devotion brings solace during life’s hardships. This avatar teaches that true wealth is found in love and faith. Venkateswara inspires us to persevere and never lose hope.'
    },
    {
        'name': 'Kalki (The Future Warrior)',
        'image': 'Kalki.png',
        'bg_image': 'kalki-bg.png',
        'desc': 'The prophesied avatar who will appear at the end of Kali Yuga.',
        'brief': 'Kalki, the final avatar, is destined to appear at the end of Kali Yuga to restore righteousness. He represents the promise of renewal, hope, and a new dawn. Kalki’s story teaches that darkness is always followed by light. He motivates us to never give up, even in times of despair. Kalki’s arrival is a reminder that justice will always triumph. He inspires us to be courageous and prepare for positive change. The avatar encourages us to fight ignorance and uphold truth. Kalki shows that every ending is a new beginning for the world. He motivates us to keep faith and work for a better tomorrow. Kalki’s prophecy teaches us to be ready for transformation and renewal.'
    },
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/avatars')
def avatars_page():
    return render_template('avatars.html', avatars=avatars)

if __name__ == "__main__":
    app.run(debug=True)
