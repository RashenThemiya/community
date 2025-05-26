
const Footer = () => {
    return (
        <footer className="bg-green-800 text-white py-12 px-4 mt-auto shadow-inner">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm md:text-base text-lime-100">
                    {/* Office Details */}
                    <div>
                        <h4 className="text-xl font-semibold text-white mb-4 border-b border-lime-300 pb-2">Office Details</h4>
                        <ul className="space-y-1">
                            <li>Cristy Wijerathna</li>
                            <li>Manager</li>
                            <li>Management Office</li>
                            <li>Dedicated Economic Center</li>
                            <li>Dambulla</li>
                        </ul>
                    </div>

                    {/* General Inquiries */}
                    <div>
                        <h4 className="text-xl font-semibold text-white mb-4 border-b border-lime-300 pb-2">General Inquiries</h4>
                        <ul className="space-y-2">
                            <li>📞 <span className="font-medium">Phone:</span> <a href="tel:0662285181" className="hover:text-white">066 2285181</a></li>
                            <li>📧 <span className="font-medium">Email:</span> <a href="mailto:dambulladec@gmail.com" className="hover:text-white">dambulladec@gmail.com</a></li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="text-xl font-semibold text-white mb-4 border-b border-lime-300 pb-2">Follow Us</h4>
                        <div className="flex space-x-5">
                            <a href="https://www.facebook.com/100027588023825" target="_blank" rel="noopener noreferrer" className="hover:text-white text-2xl transition-transform hover:scale-110">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-2xl transition-transform hover:scale-110">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-2xl transition-transform hover:scale-110">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-2xl transition-transform hover:scale-110">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="mt-10 border-t border-lime-400 pt-5 text-center text-lime-200 text-sm">
                    &copy; {new Date().getFullYear()} <span className="font-semibold">Dambulla Economic Center</span>. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
